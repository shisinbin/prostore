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
  const ratingValues = PRODUCT_RATINGS.map(({ value }) => value);
  if (!ratingValues.includes(numericRating)) return {};

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

type SearchParamsType = {
  q?: string;
  category?: string;
  price?: string;
  rating?: string;
  sort?: string;
  page?: string;
};

type FilterProps = {
  existingParams: SearchParamsType;
  filter: Partial<SearchParamsType>;
};

// Construct the filter URL
export const getFilterUrl = ({
  existingParams,
  filter,
}: FilterProps) => {
  const newParams = { ...existingParams, ...filter };

  // Remove keys that have 'all' or empty values
  Object.keys(newParams).forEach((key) => {
    if (
      newParams[key as keyof SearchParamsType] === 'all' ||
      newParams[key as keyof SearchParamsType] === ''
    ) {
      delete newParams[key as keyof SearchParamsType];
    }
  });

  if (Object.keys(newParams).length === 0) return '/browse';

  return `/browse?${new URLSearchParams(newParams).toString()}`;
};
