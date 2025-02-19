import CartTable from './CartTable';
import { getMyCart } from '@/lib/actions/cart.actions';

export const metadata = { title: 'Shopping Cart' };

async function CartPage() {
  const cart = await getMyCart();

  return (
    <>
      <CartTable cart={cart} />
    </>
  );
}

export default CartPage;
