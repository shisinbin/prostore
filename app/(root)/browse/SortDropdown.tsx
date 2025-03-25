'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SORT_OPTIONS } from '@/lib/constants';

function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const sortOptionsId = React.useId();

  const handleSortChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());

    params.set('sort', selectedSort);

    startTransition(async () => {
      router.push(`/browse?${params.toString()}`);
    });
  };

  return (
    <>
      <label
        htmlFor={sortOptionsId}
        className='text-slate-500 text-sm'
      >
        Sort by:
      </label>
      <select
        id={sortOptionsId}
        value={searchParams.get('sort') || 'newest'}
        onChange={handleSortChange}
        className='bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors px-2 py-1 rounded-md focus:outline-none cursor-pointer ml-2'
        disabled={isPending}
      >
        {SORT_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </>
  );
}

export default SortDropdown;
