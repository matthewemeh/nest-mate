import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import useAdmin from 'hooks/useAdmin';

import PageLayout from 'layouts/PageLayout';
import { PATHS } from 'routes/PathConstants';

const Home = () => {
  const { DASHBOARD, HOSTELS } = PATHS;
  const navigate = useNavigate();

  const isAdmin = useAdmin();

  useEffect(() => {
    isAdmin ? navigate(DASHBOARD) : navigate(HOSTELS);
  }, []);

  return <PageLayout extraClassNames='p-4'>Home</PageLayout>;
};

export default Home;
