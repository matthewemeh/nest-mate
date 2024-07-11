import { useEffect, useState } from 'react';
import { MdOutlineBallot } from 'react-icons/md';

import { handleReduxQueryError } from 'utils';

import { useAppSelector } from 'hooks/useRootStorage';
import { useGetReservationsMutation } from 'services/apis/reservationApi/reservationStoreApi';

import ReservationTab from 'components/ReservationTab';
import PaginationControls from 'components/PaginationControls';
import ReservationsHeader from 'components/ReservationsHeader';

const Reservations = () => {
  const MIN_PAGE_INDEX = 1;

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const { pages, paginatedReservations } = useAppSelector(state => state.reservationStore);

  const [getReservations, { error, isError, isLoading }] = useGetReservationsMutation();

  useEffect(() => {
    getReservations({ params: { page, limit } });
  }, []);

  useEffect(() => {
    handleReduxQueryError(isError, error);
  }, [error, isError]);

  return (
    <div>
      <h1 className='font-bold text-3xl'>Reservations</h1>

      <section className='mt-5 bg-swan-white rounded py-5 px-4'>
        <div className='mb-5 flex items-center justify-between'>
          <PaginationControls
            page={page}
            pages={pages}
            setPage={setPage}
            extraClassNames='ml-auto'
          />
        </div>

        {paginatedReservations.length > 0 && <ReservationsHeader />}

        <ul className='flex flex-col gap-4 mt-4'>
          {paginatedReservations.length > 0 ? (
            paginatedReservations.map(reservation => (
              <li
                key={reservation._id}
                className='border-t border-lightning-yellow-700 last:border-b'>
                <ReservationTab reservation={reservation} />
              </li>
            ))
          ) : (
            <div className='flex flex-col gap-4 items-center justify-center'>
              <MdOutlineBallot className='w-10 h-10' />
              No Reservations made
            </div>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Reservations;
