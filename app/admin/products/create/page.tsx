import ProductForm from '@/components/admin/ProductForm';
import { requireAdmin } from '@/lib/auth-guard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Product',
};

async function CreateProductPage() {
  await requireAdmin();

  return (
    <div className='space-y-8 max-w-5xl mx-auto'>
      <h2 className='h2-bold'>Create Product</h2>

      <ProductForm type='create' />
    </div>
  );
}

export default CreateProductPage;
