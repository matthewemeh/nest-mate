import { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { PATHS } from 'routes/PathConstants';
import { addClass, removeClass } from '../utils';

type AppRoute = (typeof PATHS)[keyof typeof PATHS];

interface Props {
  to: AppRoute;
  icon: JSX.Element;
}

const NavigationTab: React.FC<Props> = ({ to, icon }) => {
  const NAV_LINK = 'nav-link';
  const { pathname } = useLocation();
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (pathname === to) addClass(linkRef.current, 'active');
    else removeClass(linkRef.current, 'active');
  }, [pathname, linkRef]);

  return (
    <Link
      to={to}
      ref={linkRef}
      className={`${NAV_LINK} flex text-[17px] font-medium items-center px-3 py-2.5 gap-4 border border-transparent rounded-md transition-colors ease-in-out duration-300 hover:border-current`}>
      {icon}
    </Link>
  );
};

export default NavigationTab;
