import ProductList from '@/components/shared/Product/ProductList';
import { getLatestProducts } from '@/lib/actions/product.actions';
// import sampleData from '@/db/sample-data';

// export const metadata = {
//   title: 'This Page',
// };

async function HomePage() {
  const latestProducts = await getLatestProducts();

  return (
    <>
      <ProductList
        data={latestProducts}
        title='Newest Arrivals'
        limit={4}
      />
    </>
  );
}

export default HomePage;
