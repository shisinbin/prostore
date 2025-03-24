'use server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/db/prisma';
import {
  convertToPlainObject,
  delay,
  formatError,
  isNumeric,
} from '../utils';
import {
  LATEST_PRODUCTS_LIMIT,
  PAGE_SIZE,
  PRODUCT_RATINGS,
} from '../constants';
import {
  insertProductSchema,
  updateProductSchema,
} from '../validators';
import slugify from 'slugify';
import { deleteImages } from './uploadthing.actions';
import {
  getOrderBy,
  getPriceFilter,
  getRatingFilter,
} from '../utils/product.utils';

// Get latest products
export async function getLatestProducts() {
  const data = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: { createdAt: 'desc' },
  });

  return convertToPlainObject(data);
  // return data.map((product) => ({
  //   ...product,
  //   price: product.price.toString(),
  //   rating: product.rating.toString(),
  // }));
}

// Get single product by its slug
export async function getProductBySlug(slug: string) {
  return await prisma.product.findFirst({
    where: { slug: slug },
  });
}
// Get single product by its ID
export async function getProductById(productId: string) {
  const data = await prisma.product.findFirst({
    where: { id: productId },
  });

  return convertToPlainObject(data);
}

// Get all products
export async function getAllProducts({
  query = 'all',
  limit = PAGE_SIZE,
  page = 1,
  category,
  price,
  rating,
  sort = 'newest',
}: {
  query?: string;
  limit?: number;
  page?: number;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
}) {
  // Filters
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          },
        }
      : {};
  const categoryFilter =
    category && category !== 'all' ? { category } : {};
  const priceFilter = getPriceFilter(price);
  const ratingFilter = getRatingFilter(rating);

  // Merge filters
  const whereClause = {
    ...queryFilter,
    ...categoryFilter,
    ...ratingFilter,
    ...priceFilter,
  };

  const orderBy = getOrderBy(sort);

  const data = await prisma.product.findMany({
    where: whereClause,
    orderBy,
    skip: (page - 1) * limit,
    take: limit,
  });

  const dataCount = await prisma.product.count({
    where: whereClause,
  });

  return { data, totalPages: Math.ceil(dataCount / limit) };
}

// Delete a product
export async function deleteProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new Error('Product not found');

    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    // Delete images asynchronously
    if (product.images?.length) {
      deleteImages(product.images).then((res) => {
        if (!res.success) console.error(res.message);
      });
    }

    return { success: true, message: 'Product deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Helper function to generate a unique product slug
async function generateUniqueSlug(name: string, productId?: string) {
  const baseSlug = slugify(name, { lower: true, strict: true });

  let uniqueSlug = baseSlug;
  let counter = 1;

  while (true) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: uniqueSlug },
      select: { id: true },
    });

    if (!existingProduct || existingProduct.id === productId) {
      // Either slug is unique or we're updating the same product
      return uniqueSlug;
    }

    // Append a number and check again
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
}

// Create a product
export async function createProduct(
  data: z.infer<typeof insertProductSchema>
) {
  try {
    const product = insertProductSchema.parse(data);

    // Ensure slug is compatible and unique
    product.slug = await generateUniqueSlug(product.slug);

    await prisma.product.create({ data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update a product
export async function updateProduct(
  data: z.infer<typeof updateProductSchema>
) {
  try {
    const product = updateProductSchema.parse(data);

    const productExists = await prisma.product.findUnique({
      where: { id: product.id },
    });
    if (!productExists) throw new Error('Product not found');

    // Ensure slug is compatible and unique
    product.slug = await generateUniqueSlug(product.slug, product.id);

    await prisma.product.update({
      where: { id: product.id },
      data: product,
    });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

type CategoryDataType = {
  category: string;
  _count: number;
}[];

// Get all categories
export async function getAllCategories() {
  // const data = await prisma.product.groupBy({
  //   by: ['category'],
  //   _count: true,
  // });

  const rawData = await prisma.$queryRaw<
    Array<{ category: string; _count: Prisma.Decimal }>
  >`SELECT category, COUNT(*) as _count FROM "Product" GROUP BY category`;

  const data: CategoryDataType = rawData.map((entry) => ({
    category: entry.category,
    _count: Number(entry._count),
  }));

  return data;
}

// Get featured products
export async function getFeaturedProducts() {
  const data = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return convertToPlainObject(data);
}
