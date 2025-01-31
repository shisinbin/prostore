import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductPrice from '@/components/shared/Product/ProductPrice';
import ProductImages from '@/components/shared/Product/ProductImages';

import { getProductBySlug } from '@/lib/actions/product.actions';

async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <section>
      <div className='grid md:grid-cols-5 grid-cols-1'>
        {/* Image column */}
        <div className='md:col-span-2'>
          <ProductImages images={product.images} />
        </div>
        {/* Details column */}
        <div className='md:col-span-2 p-5 flex flex-col gap-6'>
          <p>
            {product.brand} {product.category}
          </p>
          <h1 className='h3-bold'>{product.name}</h1>
          <p>
            {`${product.rating} out of ${product.numReviews} reviews`}
          </p>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
            <ProductPrice
              value={Number(product.price)}
              className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'
            />
          </div>
          <div className='mt-10'>
            <p className='font-semibold'>Description</p>
            <p>{product.description}</p>
          </div>
        </div>
        {/* Actions column */}
        <div className='md:col-span-1'>
          <Card>
            <CardContent className='p-4'>
              <div className='mb-2 flex justify-between'>
                <span>Price</span>
                <ProductPrice value={Number(product.price)} />
              </div>
              <div className='flex justify-between'>
                <span>Status</span>
                {product.stock > 0 ? (
                  <Badge variant='outline'>In Stock</Badge>
                ) : (
                  <Badge variant='destructive'>Out Of Stock</Badge>
                )}
              </div>
              {product.stock > 0 && (
                <Button className='w-full mt-2'>
                  <Plus /> Add To Cart
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default ProductDetailsPage;
