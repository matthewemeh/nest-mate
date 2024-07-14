import { MdOutlineStarOutline } from 'react-icons/md';

import { useAppSelector } from 'hooks/useRootStorage';

import RatingTab from 'components/RatingTab';
import RatingsHeader from 'components/RatingsHeader';

const Ratings = () => {
  const { ratings } = useAppSelector(state => state.userStore.currentUser);

  return (
    <section className='mod-1 mt-5 bg-swan-white rounded py-2'>
      {ratings.length > 0 && <RatingsHeader view='USER' />}

      <ul className='flex flex-col gap-4 mt-4'>
        {ratings.length > 0 ? (
          ratings.map(rating => (
            <li key={rating._id} className='border-t border-lightning-yellow-700 last:border-b'>
              <RatingTab view='USER' rating={rating} />
            </li>
          ))
        ) : (
          <div className='mt-5 flex flex-col gap-4 items-center justify-center'>
            <MdOutlineStarOutline className='w-10 h-10' />
            No Ratings made
          </div>
        )}
      </ul>
    </section>
  );
};

export default Ratings;
