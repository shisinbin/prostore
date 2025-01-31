'use client';
import React from 'react';
import Image from 'next/image';

import { cn } from '@/lib/utils';

function ProductImages({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  return (
    <div className='space-y-4'>
      <div className='relative w-full aspect-square'>
        <Image
          src={images[currentIndex]}
          alt={`product image ${currentIndex + 1}`}
          fill
          priority
          className='min-h-[300px] object-cover object-center'
        />
      </div>
      <div className='flex gap-2'>
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'border-none w-[100px] aspect-square relative overflow-hidden',
              'hover:ring-2 hover:ring-orange-500',
              'focus:outline-none focus:ring-2 focus:ring-orange-500',
              currentIndex === index && 'ring-2 ring-orange-500'
            )}
          >
            <Image
              src={image}
              alt={`product image ${index} thumbnail`}
              fill
              className='object-fit object-center'
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductImages;
