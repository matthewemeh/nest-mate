import { Outlet, useNavigate } from 'react-router-dom';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import Loading from 'components/Loading';
import ProfileBar from 'components/ProfileBar';
import Navigation from 'components/Navigation';

import { PATHS } from 'routes/PathConstants';
import { useAppSelector } from 'hooks/useRootStorage';

const NavLayout = () => {
  const { LOGIN, VERIFY_EMAIL } = PATHS;

  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [transparent, setTransparent] = useState<boolean>(true);

  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { emailValidated, token } = useAppSelector(state => state.userStore.currentUser);

  const watchContentScroll = useCallback(() => {
    const scrollYPos = contentRef.current!.scrollTop;
    if (scrollYPos >= 10) setTransparent(false);
    else setTransparent(true);
  }, [transparent]);

  useEffect(() => {
    contentRef.current!.addEventListener('scroll', watchContentScroll);
  }, []);

  useEffect(() => {
    if (!token) navigate(LOGIN);
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) navigate(LOGIN);
    else if (!emailValidated) navigate(VERIFY_EMAIL);
  }, [emailValidated, isAuthenticated]);

  return (
    <main className='h-screen grid grid-cols-[5%_95%] grid-rows-[10%_90%]'>
      <Navigation />
      <ProfileBar extraClassNames={`${transparent || 'z-[1] shadow-[5px_4px_5px_0px_#000]'}`} />
      <div ref={contentRef} className='overflow-y-auto p-4'>
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
};

export default NavLayout;
