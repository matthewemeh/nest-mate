import { useMemo } from 'react';
import { Rating } from 'react-simple-star-rating';

import { useAppSelector } from 'hooks/useRootStorage';

interface Props {
  rating: Rating;
  view?: 'ROOM' | 'USER';
}

const RatingTab: React.FC<Props> = ({ rating, view = 'ROOM' }) => {
  const {
    value,
    roomID: { roomNumber },
    hostelID: { name: hostelName },
    userID: { name: userName, _id }
  } = rating;
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);
  const isYou = useMemo<boolean>(() => _id === userID, [_id, userID]);

  return (
    <div className='flex items-center justify-between px-4 py-2.5 bg-lightning-yellow-100 text-xl font-medium text-woodsmoke rounded-md shadow-md'>
      <p>{isYou ? 'You' : userName}</p>

      {view === 'USER' && (
        <>
          <p>{hostelName}</p>

          <p>{roomNumber}</p>
        </>
      )}

      <Rating transition readonly allowFraction initialValue={value} SVGclassName='inline' />
    </div>
  );
};

export default RatingTab;
