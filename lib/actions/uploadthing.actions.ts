'use server';
import { utapi } from '../uploadthing.server';
import { formatError } from '../utils';

// Delete a single image
export async function deleteImage(imageUrl: string) {
  try {
    const fileKey = imageUrl.split('/').pop();
    if (!fileKey) throw new Error('Invalid image URL');

    const res = await utapi.deleteFiles(fileKey);

    if (!res.success) {
      throw new Error('Failed to delete image');
    }

    return { success: true, message: 'Image deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Delete multiple images
export async function deleteImages(imageUrls: string[]) {
  try {
    const fileKeys = imageUrls
      .map((url) => url.split('/').pop())
      // .filter((key): key is string => Boolean(key));
      .filter(Boolean) as string[];

    if (fileKeys.length === 0)
      throw new Error('No valid images to delete');

    const res = await utapi.deleteFiles(fileKeys);

    if (!res.success) {
      throw new Error('Failed to delete images');
    }

    return { success: true, message: 'Images deleted successfully' };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}
