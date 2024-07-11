import { BsGridFill } from 'react-icons/bs';
import { FiUserCheck } from 'react-icons/fi';
import { MdOutlineBallot } from 'react-icons/md';
import { RiHome4Line, RiUser3Line, RiHotelLine } from 'react-icons/ri';

import NavigationTab from './NavigationTab';

import useAuth from 'hooks/useAuth';
import { PATHS } from 'routes/PathConstants';
import { useAppSelector } from 'hooks/useRootStorage';

const Navigation = () => {
  const isAuthorized: boolean = useAuth();
  const { HOME, PROFILE, HOSTELS, RESERVATIONS, DASHBOARD, ENTRIES } = PATHS;
  const { prefersDarkMode } = useAppSelector(state => state.userData);

  return (
    <nav
      className={`row-start-1 row-end-3 p-3 pt-20 bg-swan-white ${
        prefersDarkMode && 'dark:text-zircon dark:bg-nile-blue-900'
      }`}>
      <ul className={`text-oslo-gray flex flex-col gap-2`}>
        <li>
          <NavigationTab to={HOME} icon={<RiHome4Line className='text-current' />} />
        </li>
        <li>
          <NavigationTab to={HOSTELS} icon={<RiHotelLine className='text-current text-[21px]' />} />
        </li>
        <li>
          <NavigationTab to={PROFILE} icon={<RiUser3Line className='text-current text-[21px]' />} />
        </li>
        {isAuthorized && (
          <>
            <li>
              <NavigationTab
                to={RESERVATIONS}
                icon={<MdOutlineBallot className='text-current text-[21px]' />}
              />
            </li>
            <li>
              <NavigationTab
                to={DASHBOARD}
                icon={<BsGridFill className='text-current text-[21px]' />}
              />
            </li>
            <li>
              <NavigationTab
                to={ENTRIES}
                icon={<FiUserCheck className='text-current text-[21px]' />}
              />
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
