import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import useAdmin from 'hooks/useAdmin';
import { useAppSelector } from 'hooks/useRootStorage';

import PageLayout from 'layouts/PageLayout';
import { PATHS } from 'routes/PathConstants';

const Home = () => {
  const MIN_PAGE_INDEX = 1;
  const { DASHBOARD, HOSTELS } = PATHS;
  const navigate = useNavigate();

  const isAdmin = useAdmin();

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const { _id } = useAppSelector(state => state.userStore.currentUser);

  useEffect(() => {
    isAdmin ? navigate(DASHBOARD) : navigate(HOSTELS);
  }, []);

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  return <PageLayout extraClassNames='p-4'>Home</PageLayout>;
};

export default Home;
