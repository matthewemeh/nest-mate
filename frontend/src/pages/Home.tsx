import { useEffect, useState } from 'react';

import { useAppSelector } from 'hooks/useRootStorage';

import PageLayout from 'layouts/PageLayout';

const Home = () => {
  const MIN_PAGE_INDEX = 1;

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const { _id } = useAppSelector(state => state.userStore.currentUser);

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  return <PageLayout extraClassNames='p-4'>Home</PageLayout>;
};

export default Home;
