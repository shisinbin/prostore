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

export const USER_ROLES = ['user', 'admin'];

export const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'lowest' },
  { label: 'Price: High to Low', value: 'highest' },
  { label: 'Rating', value: 'rating' },
];
export const PRODUCT_RATINGS = [
  { label: '4 stars and up', value: 4 },
  { label: '3 stars and up', value: 3 },
  { label: '2 stars and up', value: 2 },
  { label: '1 stars and up', value: 1 },
];
export const PRICES = [
  { label: '$1 to $50', value: '1-50' },
  { label: '$51 to $100', value: '51-100' },
  { label: '$101 to $200', value: '101-200' },
  { label: '$201 to $500', value: '201-500' },
  { label: '$501 to $1000', value: '501-1000' },
];
