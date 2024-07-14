import { ImEnter } from 'react-icons/im';
import { FaUsers } from 'react-icons/fa';
import { BsGridFill } from 'react-icons/bs';
import { RiUser3Line, RiHotelLine } from 'react-icons/ri';
import { MdOutlineBallot, MdOutlineStarOutline } from 'react-icons/md';

import NavigationTab from './NavigationTab';

import useAuth from 'hooks/useAuth';
import { PATHS } from 'routes/PathConstants';

const Navigation = () => {
  const isAuthorized: boolean = useAuth();
  const { PROFILE, HOSTELS, RESERVATIONS, DASHBOARD, ENTRIES, MANAGE_USERS, RATINGS } = PATHS;

  return (
    <nav className='row-start-1 row-end-3 p-3 pt-20 bg-swan-white'>
      <ul className='text-oslo-gray flex flex-col gap-2'>
        {isAuthorized && (
          <li>
            <NavigationTab
              to={DASHBOARD}
              icon={<BsGridFill className='!text-inherit text-[21px]' />}
            />
          </li>
        )}
        <li>
          <NavigationTab
            to={HOSTELS}
            icon={<RiHotelLine className='!text-inherit text-[21px]' />}
          />
        </li>
        {isAuthorized && (
          <>
            <li>
              <NavigationTab
                to={RESERVATIONS}
                icon={<MdOutlineBallot className='!text-inherit text-[21px]' />}
              />
            </li>
            <li>
              <NavigationTab
                to={ENTRIES}
                icon={<ImEnter className='!text-inherit text-[21px]' />}
              />
            </li>
            <li>
              <NavigationTab
                to={MANAGE_USERS}
                icon={<FaUsers className='!text-inherit text-[21px]' />}
              />
            </li>
          </>
        )}
        <li>
          <NavigationTab
            to={RATINGS}
            icon={<MdOutlineStarOutline className='!text-inherit text-[21px]' />}
          />
        </li>
        <li>
          <NavigationTab
            to={PROFILE}
            icon={<RiUser3Line className='!text-inherit text-[21px]' />}
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
