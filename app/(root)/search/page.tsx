import ProductCard from '@/components/shared/Product/ProductCard';
import { getAllProducts } from '@/lib/actions/product.actions';

export async function generateMetadata(props: {
  searchParams: Promise<{ q: string; category: string }>;
}) {
  const { q = 'all', category = 'all' } = await props.searchParams;

  let title = 'Search Products';

  const filters: string[] = [];

  if (q !== 'all' && q.trim() !== '') filters.push(`\"${q}\"`);
  if (category !== 'all' && category.trim() !== '')
    filters.push(`Category: ${category}`);

  if (filters.length > 0) {
    title = `Search Products for ${filters.join(', ')}`;
  }

  return { title };
}

async function SearchPage(props: {
  searchParams: Promise<{
    category: string;
    q: string;
    page: string;
    rating: string;
    price: string;
    sort: string;
  }>;
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

  return (
    <div className='grid md:grid-cols-5 md:gap-5'>
      <div className='filter-links'>{/* FILTERS */}</div>
      <div className='space-y-4 md:col-span-4'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {products.length === 0 ? (
            <div>No products found</div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              ></ProductCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
