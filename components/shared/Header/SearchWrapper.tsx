import Search from './Search';

async function SearchWrapper({
  categoriesPromise,
}: {
  categoriesPromise: Promise<{ category: string; _count: number }[]>;
}) {
  const categories = await categoriesPromise;
  return <Search categories={categories} />;
}

export default SearchWrapper;
