import { getMyCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';
import AddToCart from './AddToCart';

async function CartSection({ item }: { item: CartItem }) {
  const cart = await getMyCart();

  return (
    <div className='mt-2 flex-center'>
      <AddToCart cart={cart} item={item} />
    </div>
  );
}

export default CartSection;
