'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useState, useTransition } from 'react';
import { ArrowRight, Edit, Loader } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ControllerRenderProps,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { shippingAddressDefaultValues } from '@/lib/constants';
import { ShippingAddress } from '@/types';
import { shippingAddressSchema } from '@/lib/validators';
import { updateUserAddress } from '@/lib/actions/user.actions';

function ShippingAddressForm({
  address,
}: {
  address: ShippingAddress | null;
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const [isEditing, setIsEditing] = useState(!address);

  const form = useForm<ShippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

  const onSubmit: SubmitHandler<ShippingAddress> = async (values) => {
    startTransition(async () => {
      const res = await updateUserAddress(values);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      router.push('/payment-method');
    });
  };

  return (
    <div className='max-w-md mx-auto space-y-4'>
      <h2 className='h2-bold mt-4'>Shipping Address</h2>

      {!isEditing && address ? (
        <div className='space-y-4 border p-4 rounded-lg'>
          <div className='space-y-2'>
            <p>
              <strong>Full Name:</strong> {address.fullName}
            </p>
            <p>
              <strong>Address:</strong> {address.streetAddress}
            </p>
            <p>
              <strong>City:</strong> {address.city}
            </p>
            <p>
              <strong>Postal Code:</strong> {address.postalCode}
            </p>
            <p>
              <strong>Country:</strong> {address.country}
            </p>
          </div>

          <div className='flex gap-2'>
            <Button
              variant='default'
              onClick={() => router.push('/payment-method')}
            >
              Use this address <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
            <Button
              variant='outline'
              onClick={() => setIsEditing(true)}
            >
              Edit <Edit className='w-4 h-4 ml-2' />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className='text-sm text-muted-foreground'>
            Please enter an address to ship to
          </p>
          <Form {...form}>
            <form
              method='post'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4'
            >
              <FormField
                control={form.control}
                name='fullName'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    ShippingAddress,
                    'fullName'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter full name'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='streetAddress'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    ShippingAddress,
                    'streetAddress'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter address' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='city'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    ShippingAddress,
                    'city'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter city' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='postalCode'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    ShippingAddress,
                    'postalCode'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter postal code'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='country'
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<
                    ShippingAddress,
                    'country'
                  >;
                }) => (
                  <FormItem className='w-full'>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter country' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' disabled={isPending}>
                {isPending ? (
                  <Loader className='w-4 h-4 animate-spin' />
                ) : (
                  <ArrowRight className='w-4 h-4' />
                )}{' '}
                Continue
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}

export default ShippingAddressForm;
