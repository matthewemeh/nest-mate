import { useMemo } from 'react';
import { Rating } from 'react-simple-star-rating';

import { useAppSelector } from 'hooks/useRootStorage';

interface Props {
  rating: Rating;
}

const RatingTab: React.FC<Props> = ({ rating }) => {
  const {
    value,
    userID: { name, _id }
  } = rating;
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);
  const isYou = useMemo<boolean>(() => _id === userID, [_id, userID]);

  return (
    <div className='flex items-center justify-between px-4 py-2.5 bg-lightning-yellow-100 rounded-md shadow-md'>
      <p className='text-xl font-medium'>{isYou ? 'You' : name}</p>

      <Rating transition readonly allowFraction initialValue={value} SVGclassName='inline' />
    </div>
  );
};

export default RatingTab;
