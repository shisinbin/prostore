'use client';
import React from 'react';
import Image from 'next/image';
import { deleteImage } from '@/lib/actions/uploadthing.actions';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

interface ProductThumbnailProps {
  src: string;
  onDelete: (deletedImage: string) => void;
}

function ProductThumbnail({ src, onDelete }: ProductThumbnailProps) {
  const [isDeleting, startTransition] = React.useTransition();
  // const [isHidden, setIsHidden] = React.useState(false);

  const { toast } = useToast();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteImage(src);
      if (res.success) {
        // setIsHidden(true);
        onDelete(src);
        toast({
          description: res.message,
        });
      } else {
        toast({
          variant: 'destructive',
          description: res.message,
        });
      }
    });
  };

  // if (isHidden) return null;

  return (
    <div className='relative group'>
      <Image
        src={src}
        alt='product thumbnail'
        className='w-20 h-20 object-cover rounded-sm'
        width={80}
        height={80}
        quality={80}
      />
      <Button
        variant='destructive'
        size='sm'
        className='absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity'
        onClick={handleDelete}
        disabled={isDeleting}
      >
        x
      </Button>
    </div>
  );
}

export default ProductThumbnail;
