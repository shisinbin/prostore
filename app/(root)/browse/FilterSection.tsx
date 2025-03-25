import { getFilterUrl } from '@/lib/utils/product.utils';
import Link from 'next/link';
import { SearchPageProps } from '@/types';

function FilterSection({
  title,
  paramKey,
  searchParams,
  options,
  selectedValue,
}: {
  paramKey: keyof SearchPageProps;
  searchParams: SearchPageProps;
  options: { label: string; value: string | number }[];
  title: string;
  selectedValue: string;
}) {
  return (
    <section>
      <h3 className='text-xl'>{title}</h3>
      <ul className='mt-1 space-y-1'>
        <li>
          <Link
            className={selectedValue === 'all' ? 'font-bold' : ''}
            href={getFilterUrl({
              existingParams: searchParams,
              filter: { [paramKey]: 'all' },
            })}
          >
            Any
          </Link>
        </li>
        {options.map((option) => (
          <li key={option.value}>
            <Link
              className={
                selectedValue === String(option.value)
                  ? 'font-bold'
                  : ''
              }
              href={getFilterUrl({
                existingParams: searchParams,
                filter: { [paramKey]: option.value },
              })}
            >
              {option.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default FilterSection;
