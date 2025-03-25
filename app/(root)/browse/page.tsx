import Link from 'next/link';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import ProductCard from '@/components/shared/Product/ProductCard';
import CategoryFilterSection from './CategoryFilterSection';
import FilterSection from './FilterSection';
import SortDropdown from './SortDropdown';
import Pagination from '@/components/shared/Pagination';

import { getFilterUrl } from '@/lib/utils/product.utils';
import { getAllProducts } from '@/lib/actions/product.actions';
import { PRICES, PRODUCT_RATINGS } from '@/lib/constants';
import { SearchPageProps } from '@/types';

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  let title = 'Search Products';

  const filters: string[] = [];

  if (q !== 'all' && q.trim() !== '') filters.push(`\"${q}\"`);
  if (category !== 'all' && category.trim() !== '') {
    filters.push(`Category: ${category}`);
  }
  if (price !== 'all' && price.trim() !== '') {
    filters.push(
      `Price: ${
        PRICES.find(({ value }) => price === value)?.label || price
      }`
    );
  }
  if (rating !== 'all' && rating.trim() !== '') {
    filters.push(
      `Rating: ${
        PRODUCT_RATINGS.find((r) => String(r.value) === rating)
          ?.label || rating
      }`
    );
  }

  if (filters.length > 0) {
    title = `Search Products for ${filters.join(', ')}`;
  }

  return { title };
}

async function SearchPage(props: {
  searchParams: Promise<SearchPageProps>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams?.q ?? 'all';
  const category = searchParams?.category ?? 'all';
  const price = searchParams?.price ?? 'all';
  const rating = searchParams?.rating ?? 'all';
  const sort = searchParams?.sort ?? 'newest';
  const currentPage = Number(searchParams?.page) || 1;

  const { data: products, totalPages } = await getAllProducts({
    query,
    category,
    price,
    rating,
    sort,
    page: currentPage,
  });

  const atLeastOneFilterParam =
    (query !== '' && query !== 'all') ||
    (category !== '' && category !== 'all') ||
    (price !== '' && price !== 'all') ||
    (rating !== '' && rating !== 'all');

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <aside className='flex flex-col gap-8'>
        <CategoryFilterSection
          currentCategory={category}
          searchParams={searchParams}
        />
        <FilterSection
          title='Price'
          paramKey='price'
          searchParams={searchParams}
          options={PRICES}
          selectedValue={price}
        />
        <FilterSection
          title='Customer Review'
          paramKey='rating'
          searchParams={searchParams}
          options={PRODUCT_RATINGS}
          selectedValue={rating}
        />
      </aside>
      <div className='space-y-4 md:col-span-4'>
        <div className='flex-between flex-col my-2 md:flex-row items-baseline'>
          <div className='flex items-center gap-2'>
            {query !== 'all' && query !== '' && (
              <FilterPill
                label={`Filtered by \"${query}\"`}
                url={getFilterUrl({
                  existingParams: searchParams,
                  filter: { q: '' },
                })}
              />
            )}
            {category !== 'all' && category !== '' && (
              <FilterPill
                label={category}
                url={getFilterUrl({
                  existingParams: searchParams,
                  filter: { category: '' },
                })}
              />
            )}
            {price !== 'all' && price !== '' && (
              <FilterPill
                label={
                  PRICES.find(({ value }) => price === value)
                    ?.label || price
                }
                url={getFilterUrl({
                  existingParams: searchParams,
                  filter: { price: '' },
                })}
              />
            )}
            {rating !== 'all' && rating !== '' && (
              <FilterPill
                label={`${rating} stars & up`}
                url={getFilterUrl({
                  existingParams: searchParams,
                  filter: { rating: '' },
                })}
              />
            )}
            {atLeastOneFilterParam && (
              <Button
                variant='link'
                asChild
                className='text-slate-500'
              >
                <Link href='/browse'>Clear All</Link>
              </Button>
            )}
          </div>
          <div className='flex items-baseline'>
            <SortDropdown />
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {products.length === 0 ? (
            <div>No products found</div>
          ) : (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        {Number(totalPages) > 1 && (
          <Pagination totalPages={Number(totalPages)} />
        )}
      </div>
    </div>
  );
}

function FilterPill({ label, url }: { label: string; url: string }) {
  return (
    <div className='flex items-center gap-2 bg-muted pl-3 py-0 rounded-md'>
      <span className='text-sm'>{label}</span>

      <Button
        asChild
        size='sm'
        variant='ghost'
        className='hover:text-destructive'
      >
        <Link href={url}>
          <X />
        </Link>
      </Button>
    </div>
  );
}

export default SearchPage;
