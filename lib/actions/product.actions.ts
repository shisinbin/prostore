'use server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/db/prisma';
import { convertToPlainObject, formatError } from '../utils';
import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '../constants';
import {
  insertProductSchema,
  updateProductSchema,
} from '../validators';
import slugify from 'slugify';
import { deleteImages } from './uploadthing.actions';

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
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string;
  limit?: number;
  page: number;
  category?: string;
}) {
  // Query filter
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {};

  // Category filter
  const categoryFilter =
    category && category !== 'all' ? { category } : {};

  // Merge filters
  const whereClause = {
    ...queryFilter,
    ...categoryFilter,
  };

  const data = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
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
