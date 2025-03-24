'use client';
import React from 'react';
import { SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { useSearchParams } from 'next/navigation';

function Search({
  categories,
}: {
  categories: { category: string; _count: number }[];
}) {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = React.useState(
    searchParams.get('category') ?? 'all'
  );
  const [query, setQuery] = React.useState(
    searchParams.get('q') ?? ''
  );

  React.useEffect(() => {
    setSelectedCategory(searchParams.get('category') ?? 'all');
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  return (
    <form action='/search' method='GET'>
      <div className='flex gap-2'>
        <Select
          name='category'
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className='w-[180px]'>
            <span>
              {selectedCategory === 'all' ? 'All' : selectedCategory}
            </span>
          </SelectTrigger>

          <SelectContent>
            <SelectItem key='All' value='all'>
              All
            </SelectItem>
            {categories.map(({ category }) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name='q'
          type='text'
          placeholder='Search...'
          className='md:w-[100px] lg:w-[300px]'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type='submit' variant='outline'>
          <SearchIcon />
        </Button>
      </div>
    </form>
  );
}

export default Search;
