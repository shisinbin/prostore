'use client'; // Error components must be Client Components

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='items-center'>
          <AlertTriangle className='h-12 w-12 text-destructive mb-4' />
          <CardTitle className='text-center'>
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className='text-center'>
            We encountered an unexpected error.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Only show error details in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className='bg-muted p-3 rounded-md'>
              <p className='text-sm font-mono text-destructive'>
                {error.message}
              </p>
              {error.digest && (
                <p className='text-xs text-muted-foreground mt-2'>
                  Error Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className='flex flex-col space-y-2'>
            <Button
              onClick={() => reset()}
              variant='default'
              className='w-full'
            >
              Try Again
            </Button>
            <Button
              onClick={() => (window.location.href = '/')}
              variant='outline'
              className='w-full'
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
