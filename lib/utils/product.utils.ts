import { PRICES, PRODUCT_RATINGS } from '../constants';
import { Prisma } from '@prisma/client';

export function getPriceFilter(
  price: string | undefined
): Prisma.ProductWhereInput {
  const validPrice = PRICES.find((p) => p.value === price);
  if (!validPrice) return {};

  const [min, max] = validPrice.value.split('-').map(Number);
  if (isNaN(min) || isNaN(max)) return {};

  return { price: { gte: min, lte: max } };
}

export function getRatingFilter(
  rating: string | undefined
): Prisma.ProductWhereInput {
  const numericRating = Number(rating);
  if (!PRODUCT_RATINGS.includes(numericRating)) return {};

  return { rating: { gte: numericRating } };
}

export function getOrderBy(
  sortOption: string | undefined
): Prisma.ProductOrderByWithRelationInput {
  switch (sortOption) {
    case 'lowest':
      return { price: 'asc' };
    case 'highest':
      return { price: 'desc' };
    case 'rating':
      return { rating: 'desc' };
    default:
      return { createdAt: 'desc' };
  }
}
