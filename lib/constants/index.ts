export const APP_NAME =
  process.env.NEXT_PUBLIC_APP_NAME || 'Prostore';

export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'A modern ecommerce platform built with Next.js';

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT = 4;

export const PROTECTED_ROUTES = [
  '/shipping-address',
  '/payment-method',
  '/place-order',
  '/profile',
  '/user',
  '/order',
  '/admin',
];

export const signInDefaultValues = {
  email: '',
  password: '',
};

export const signUpDefaultValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

export const shippingAddressDefaultValues = {
  fullName: '',
  streetAddress: '',
  city: '',
  postalCode: '',
  country: '',
};

export const PAYMENT_METHODS = process.env.NEXT_PUBLIC_PAYMENT_METHODS
  ? process.env.NEXT_PUBLIC_PAYMENT_METHODS.split(', ')
  : ['Paypal', 'Stripe', 'CashOnDelivery'];

export const DEFAULT_PAYMENT_METHOD = process.env
  .NEXT_PUBLIC_DEFAULT_PAYMENT_METHOD
  ? process.env.NEXT_PUBLIC_DEFAULT_PAYMENT_METHOD
  : 'Stripe';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 12;

export const productDefaultValues = {
  name: '',
  slug: '',
  category: '',
  images: [],
  brand: '',
  description: '',
  price: '0',
  stock: 0,
  rating: '0',
  numReviews: '0',
  isFeatured: false,
  banner: null,
};
