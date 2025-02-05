import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number): string {
  const [intValue, decimalValue] = num.toString().split('.');
  return decimalValue
    ? `${intValue}.${decimalValue.padEnd(2, '0')}`
    : `${intValue}.00`;
}

// Format errors
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === 'ZodError' && Array.isArray(error.errors)) {
    // Handle Zod error
    const fieldMessageErrors = error.errors.map(
      (e: { message: string }) => e.message
    );

    return fieldMessageErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle Prisma error
    const field = Array.isArray(error.meta?.target)
      ? error.meta.target[0]
      : 'Field';

    return `${
      field.charAt(0).toUpperCase() + field.slice(1)
    } already exists`;
  } else {
    // Handle other errors
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error
    ) {
      return typeof error.message === 'string'
        ? error.message
        : JSON.stringify(error.message);
    }

    return 'An unknown error occured';
  }
}
