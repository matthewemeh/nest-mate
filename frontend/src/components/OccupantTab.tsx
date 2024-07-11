import { useMemo, useState } from 'react';
import { RiUser3Line } from 'react-icons/ri';
import { useAppSelector } from 'hooks/useRootStorage';

interface Props {
  occupant: User;
}

const OccupantTab: React.FC<Props> = ({ occupant }) => {
  const { _id, name, profileImageUrl } = occupant;
  const { prefersDarkMode } = useAppSelector(state => state.userData);
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);

  const isYou = useMemo<boolean>(() => _id === userID, [_id, userID]);

  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <div
      key={_id}
      className='grid grid-cols-[auto_minmax(0,1fr)] items-center gap-10 px-4 py-2.5 bg-lightning-yellow-100 rounded-md shadow-md'>
      <div className='block relative w-10 h-10 bg-zircon rounded-half cursor-pointer'>
        <img
          alt=''
          loading='lazy'
          src={profileImageUrl}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full rounded-half ${imageLoaded || 'opacity-0 invisible'}`}
        />
        {imageLoaded || (
          <RiUser3Line
            className={`absolute p-2 top-0 left-0 w-full h-full text-current border rounded-full ${
              prefersDarkMode && 'dark:text-nile-blue-900'
            }`}
          />
        )}
      </div>

      <p>{isYou ? 'You' : name}</p>
    </div>
  );
};

export default OccupantTab;
