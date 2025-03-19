'use client';

import React from 'react';
import slugify from 'slugify';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { UploadButton } from '@/lib/uploadthing';

import {
  createProduct,
  updateProduct,
} from '@/lib/actions/product.actions';
import {
  insertProductSchema,
  updateProductSchema,
} from '@/lib/validators';
import { Product } from '@/types';
import { productDefaultValues } from '@/lib/constants';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '../ui/card';
import ProductThumbnail from './ProductThumbnail';
import { Checkbox } from '../ui/checkbox';
import { capitaliseWord } from '@/lib/utils';

function ProductForm({
  type,
  product,
  productId,
}: {
  type: 'create' | 'update';
  product?: Product;
  productId?: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isEditingSlug, setIsEditingSlug] = React.useState(false);

  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(
      type === 'update' ? updateProductSchema : insertProductSchema
    ),
    defaultValues:
      product && type === 'update' ? product : productDefaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  const handleSubmit: SubmitHandler<
    z.infer<typeof insertProductSchema>
  > = async (values: z.infer<typeof insertProductSchema>) => {
    if (type === 'update' && !productId) {
      router.push('/admin/products');
      return;
    }

    const res =
      type === 'update' && productId
        ? await updateProduct({ ...values, id: productId })
        : await createProduct(values);

    if (!res.success) {
      toast({
        variant: 'destructive',
        description: res.message,
      });
    } else {
      toast({
        description: res.message,
      });
      router.push('/admin/products');
    }
  };

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return (
    <Form {...form}>
      {/* : {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  'slug'
                >;
              } */}
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col md:flex-row gap-5'>
          {/* NAME */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder='Enter product name'
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      if (!isEditingSlug) {
                        form.setValue(
                          'slug',
                          slugify(e.target.value, {
                            lower: true,
                            strict: true,
                          })
                        );
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* SLUG */}

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder='edit-product-slug'
                    {...field}
                    onFocus={() => setIsEditingSlug(true)}
                    onBlur={(e) => {
                      const formattedSlug = slugify(e.target.value, {
                        lower: true,
                        strict: true,
                      });
                      form.setValue('slug', formattedSlug);
                      setIsEditingSlug(false);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* CATEGORY */}
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder='Enter product category'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* BRAND */}
          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder='Enter product brand'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col md:flex-row gap-5'>
          {/* PRICE */}
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder='Enter product price'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* STOCK */}
          <FormField
            control={form.control}
            name='stock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder='Enter product stock'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* IMAGE */}
        <div className='upload-field'>
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2'>
                      {images.map((image: string) => (
                        <ProductThumbnail
                          key={image}
                          src={image}
                          onDelete={(deletedImage) => {
                            form.setValue(
                              'images',
                              images.filter(
                                (img) => img != deletedImage
                              )
                            );
                          }}
                        />
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(
                            res: { ufsUrl: string; url: string }[]
                          ) => {
                            if (res && res[0]) {
                              const imageUrl =
                                res[0]?.ufsUrl || res[0]?.url;
                              form.setValue('images', [
                                ...images,
                                imageUrl,
                              ]);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            });
                          }}
                          className='mt-4 ut-button:bg-secondary ut-button:ut-readying:bg-secondary/50'
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field'>
          {/* FEATURED? */}
          Featured Product
          <Card>
            <CardContent className='space-y-2 pt-4'>
              <FormField
                control={form.control}
                name='isFeatured'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center space-x-3 space-y-0'>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Is Featured?</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isFeatured && banner && (
                <Image
                  src={banner}
                  alt='banner image'
                  className='w-full object-cover object-center rounded-sm'
                  width={1920}
                  height={680}
                />
              )}
              {isFeatured && !banner && (
                <UploadButton
                  endpoint='imageUploader'
                  onClientUploadComplete={(
                    res: { ufsUrl: string; url: string }[]
                  ) => {
                    if (res && res[0]) {
                      const imageUrl = res[0]?.ufsUrl || res[0]?.url;
                      form.setValue('banner', imageUrl);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      variant: 'destructive',
                      description: `ERROR! ${error.message}`,
                    });
                  }}
                  className='mt-4 ut-button:bg-secondary ut-button:ut-readying:bg-secondary/50'
                />
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {/* DESCRIPTION */}
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isSubmitting}
                    placeholder='Enter product description'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          size='lg'
          className='w-full'
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Submitting...'
            : `${capitaliseWord(type)} Product`}
        </Button>
      </form>
    </Form>
  );
}

export default ProductForm;
