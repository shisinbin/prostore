import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-guard';
import { getProductById } from '@/lib/actions/product.actions';
import ProductForm from '@/components/admin/ProductForm';

export const metadata: Metadata = {
  title: 'Update Product',
};

async function AdminProductUpdatePage(props: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();

  const { id } = await props.params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <h2 className='h2-bold'>Update product</h2>

      <ProductForm
        type='update'
        product={product}
        productId={product.id}
      />
    </div>
  );
}

export default AdminProductUpdatePage;
