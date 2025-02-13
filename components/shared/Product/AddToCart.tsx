'use client';

import { Plus, Minus, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

import { ToastAction } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Cart, CartItem } from '@/types';
import {
  addItemToCart,
  removeItemFromCart,
} from '@/lib/actions/cart.actions';

function AddToCart({ cart, item }: { cart?: Cart; item: CartItem }) {
  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item);

      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        });
        return;
      }

      // Handle success add to cart
      toast({
        description: res.message,
        action: (
          <ToastAction
            className='bg-primary text-white hover:bg-gray-800'
            altText='Go to cart'
            onClick={() => router.push('/cart')}
          >
            Go To Cart
          </ToastAction>
        ),
      });

      return;
    });
  };

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId);

      toast({
        variant: res.success ? 'default' : 'destructive',
        description: res.message,
      });

      return;
    });
  };

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId);

  return existItem ? (
    <div>
      <Button
        type='button'
        variant='outline'
        onClick={handleRemoveFromCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <Minus className='h-4 w-4' />
        )}
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button
        type='button'
        variant='outline'
        onClick={handleAddToCart}
        disabled={isPending}
      >
        {isPending ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <Plus className='w-4 h-4' />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className='w-full'
      type='button'
      onClick={handleAddToCart}
      disabled={isPending}
    >
      {isPending ? (
        <Loader className='h-4 w-4 animate-spin' />
      ) : (
        <Plus className='w-4 h-4' />
      )}{' '}
      Add To Cart
    </Button>
  );
}

export default AddToCart;
