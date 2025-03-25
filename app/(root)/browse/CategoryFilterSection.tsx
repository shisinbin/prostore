import FilterSection from './FilterSection';
import { getAllCategories } from '@/lib/actions/product.actions';

async function CategoryLinks({
  currentCategory,
  searchParams,
}: {
  currentCategory: string;
  searchParams: {
    category?: string;
    q?: string;
    page?: string;
    rating?: string;
    price?: string;
    sort?: string;
  };
}) {
  const categories = await getAllCategories();
  const normalisedCategories = categories.map(({ category: c }) => ({
    label: c,
    value: c,
  }));

  return (
    <FilterSection
      title='Category'
      paramKey='category'
      searchParams={searchParams}
      options={normalisedCategories}
      selectedValue={currentCategory}
    />
  );
}

export default CategoryLinks;
