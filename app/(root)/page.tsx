import ProductCarousel from '@/components/shared/Product/ProductCarousel';
import ProductList from '@/components/shared/Product/ProductList';
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions';
// import sampleData from '@/db/sample-data';

async function HomePage() {
  // const featuredProducts = await getFeaturedProducts();
  // const latestProducts = await getLatestProducts();

  const [featuredProducts, latestProducts] = await Promise.all([
    getFeaturedProducts(),
    getLatestProducts(),
  ]);

  return (
    <>
      {featuredProducts?.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList
        data={latestProducts}
        title='Newest Arrivals'
        limit={4}
      />
    </>
  );
}

export default HomePage;
