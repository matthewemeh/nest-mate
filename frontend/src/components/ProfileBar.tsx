import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RiMoonLine, RiSunLine, RiUser3Line } from 'react-icons/ri';

import { PATHS } from 'routes/PathConstants';
import { logout } from 'services/apis/userApi/userStoreSlice';
import { updateUserData } from 'services/userData/userDataSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';
import { FaHotel } from 'react-icons/fa';

interface Props {
  extraClassNames?: string;
}

const Profilebar: React.FC<Props> = ({ extraClassNames }) => {
  const { PROFILE, LOGIN, HOME } = PATHS;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const { profileImageUrl } = useAppSelector(state => state.userStore.currentUser);
  const { isAuthenticated, prefersDarkMode } = useAppSelector(state => state.userData);

  const signOut = () => {
    dispatch(logout());
    navigate(LOGIN);
  };

  return (
    <div
      className={`px-4 flex items-center justify-between gap-5 bg-swan-white ${
        prefersDarkMode && 'dark:bg-nile-blue-900 dark:text-nile-blue-900'
      } ${extraClassNames}`}>
      <Link to={HOME} className='flex gap-3 items-center'>
        <FaHotel className='w-7 h-7 text-lightning-yellow-700' /> Nest Mate
      </Link>
      <button
        className='w-11 h-11 p-2 bg-zircon rounded-half ml-auto'
        onClick={() => dispatch(updateUserData({ prefersDarkMode: !prefersDarkMode }))}>
        {prefersDarkMode ? (
          <RiSunLine className='w-full h-full text-current' />
        ) : (
          <RiMoonLine className='w-full h-full text-current' />
        )}
      </button>

      <div className='relative'>
        <button
          id='header-menu-button'
          aria-expanded={menuOpened}
          aria-controls='portal-menu'
          onBlur={() => setMenuOpened(false)}
          onClick={() => setMenuOpened(!menuOpened)}
          className='block relative w-11 h-11 bg-zircon rounded-half cursor-pointer'>
          <img
            alt=''
            src={profileImageUrl}
            onLoad={() => setImageLoaded(true)}
            className={`rounded-half ${imageLoaded || 'opacity-0 invisible'}`}
          />
          {(!isAuthenticated || !imageLoaded || !profileImageUrl) && (
            <RiUser3Line className='absolute p-2 top-0 left-0 w-full h-full text-current' />
          )}
        </button>

        <div
          role='menu'
          id='portal-menu'
          aria-labelledby='header-menu-button'
          onClick={() => setMenuOpened(false)}
          className={`text-[14px] text-center z-[5] bg-zircon overflow-hidden flex flex-col rounded-b w-[120px] absolute top-[calc(100%+10px)] right-0 shadow-[0_10px_20px_0_rgba(219,219,219,0.25)] duration-500 ${
            prefersDarkMode && 'dark:bg-nile-blue-900 dark:shadow-lg dark:text-zircon'
          } ${menuOpened ? 'max-h-[300px]' : 'max-h-0'}`}>
          <Link role='menuitem' to={PROFILE} className='h-10 grid place-items-center shrink-0'>
            Profile
          </Link>
          <span role='menuitem' className='h-10 shrink-0 cursor-pointer' onClick={signOut}>
            Logout
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profilebar;
