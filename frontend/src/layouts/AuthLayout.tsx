import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Loading from 'components/Loading';

const AuthLayout = () => {
  return (
    <main className='h-screen grid grid-cols-2'>
      <div></div>
      <div className='bg-swan-white text-lightning-yellow-900'>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
};
export default AuthLayout;
