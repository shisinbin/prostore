'use server';

import { prisma } from '@/db/prisma';
import { cookies } from 'next/headers';
import { CartItem } from '@/types';
import { convertToPlainObject, formatError, round2 } from '../utils';
import { auth } from '@/auth';
import { cartItemSchema, insertCartSchema } from '../validators';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';

/*
 * Calculate prices for the cart items.
 */
const calcPrice = (items: CartItem[]) => {
  const itemsPrice = round2(
      items.reduce(
        (acc, item) => acc + Number(item.price) * item.qty,
        0
      )
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
    taxPrice = round2(0.15 * itemsPrice),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
};

/*
 * Helper function to update cart in the database.
 */
async function updateCart(
  cartId: string,
  items: CartItem[],
  productSlug: string
) {
  await prisma.cart.update({
    where: { id: cartId },
    data: {
      items: items as Prisma.CartUpdateitemsInput[],
      ...calcPrice(items),
    },
  });

  revalidatePath(`/product/${productSlug}`);
}

/*
 * Main action to add an item to the cart.
 */
export async function addItemToCart(data: CartItem) {
  try {
    // Get the session cart cookie
    const sessionCartId = (await cookies()).get(
      'sessionCartId'
    )?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Get session and user ID (user is optional)
    const session = await auth();
    const userId = session?.user?.id
      ? (session.user.id as string)
      : undefined;

    // Get the current cart, if it exists
    const cart = await getMyCart();

    // Validate the incoming cart item using zod
    const item = cartItemSchema.parse(data);

    // Find the product from the database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    if (!product) throw new Error('Product not found');

    if (!cart) {
      // No cart exists yet: create a new one
      const newCart = insertCartSchema.parse({
        userId: userId,
        items: [item],
        sessionCartId: sessionCartId,
        ...calcPrice([item]),
      });

      await prisma.cart.create({
        data: newCart,
      });
      revalidatePath(`/product/${product.slug}`);

      return {
        success: true,
        message: `${product.name} added to cart`,
      };
    } else {
      // Cart exists: check if the item is already in the cart
      const items = cart.items as CartItem[];
      const existingItem = items.find(
        (x) => x.productId === item.productId
      );

      if (existingItem) {
        // Check product stock before updating quantity
        if (product.stock < existingItem.qty + 1)
          throw new Error('Not enough stock');

        existingItem.qty += 1;
      } else {
        // New item: check stock and add item to cart
        if (product.stock < 1) throw new Error('Not enough stock');
        items.push(item);
      }

      // Update the cart with new items and prices
      await updateCart(cart.id, items, product.slug);

      return {
        success: true,
        message: `${product.name} ${
          existingItem ? 'updated in' : 'added to'
        } cart`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    };
  }
}

/*
 * Retrieve the current cart from the database using either the
 * userId (if signed in) or the sessionCartId cookie.
 */
export async function getMyCart() {
  const sessionCartId = (await cookies()).get('sessionCartId')?.value;
  if (!sessionCartId) throw new Error('Cart session not found');

  const session = await auth();
  const userId = session?.user?.id
    ? (session.user.id as string)
    : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId
      ? { userId: userId }
      : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Convert decimals and return a plain object
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}

/*
 * Action to remove an item from the cart.
 */
export async function removeItemFromCart(productId: string) {
  try {
    // Get the session cart cookie
    const sessionCartId = (await cookies()).get(
      'sessionCartId'
    )?.value;
    if (!sessionCartId) throw new Error('Cart session not found');

    // Find the product from the database
    const product = await prisma.product.findFirst({
      where: { id: productId },
    });
    if (!product) throw new Error('Product not found');

    // Get the current cart, if it exists
    const cart = await getMyCart();
    if (!cart) throw new Error('Cart not found');

    // Check that item is already in the cart
    const existingItem = (cart.items as CartItem[]).find(
      (x) => x.productId === productId
    );
    if (!existingItem) throw new Error('Item not found in cart');

    // Remove item or reduce quantity from cart
    if (existingItem.qty === 1) {
      cart.items = (cart.items as CartItem[]).filter(
        (x) => x.productId !== existingItem.productId
      );
    } else {
      existingItem.qty -= 1;
    }

    // Update the cart with new items and prices
    await updateCart(cart.id, cart.items, product.slug);

    return {
      success: true,
      message: `${product.name} was removed from cart`,
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
