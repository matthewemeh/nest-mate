import { MdOutlineBallot } from 'react-icons/md';
import { useEffect, useMemo, useState } from 'react';

import { getDateProps } from 'utils';

import { useAppSelector } from 'hooks/useRootStorage';
import { useGetEntriesMutation } from 'services/apis/entryApi';
import { useGetRoomsMutation } from 'services/apis/roomApi/roomStoreApi';
import { useGetUsersMutation } from 'services/apis/userApi/userStoreApi';
import { useGetHostelsMutation } from 'services/apis/hostelApi/hostelStoreApi';
import {
  useGetReservationsMutation,
  useGetReservationsLengthMutation
} from 'services/apis/reservationApi/reservationStoreApi';

import PageLayout from 'layouts/PageLayout';
import ReservationTab from 'components/ReservationTab';
import PaginationControls from 'components/PaginationControls';
import ReservationSummaryCard from 'components/ReservationSummaryCard';

const Dashboard = () => {
  const MIN_PAGE_INDEX = 1;

  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const { _id } = useAppSelector(state => state.userStore.currentUser);
  const { monthDate: todayDate } = useMemo<DateProps>(() => getDateProps(), []);
  const { pages, paginatedReservations } = useAppSelector(state => state.reservationStore);

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  const [getUsers] = useGetUsersMutation();
  const [getRooms] = useGetRoomsMutation();
  const [getHostels] = useGetHostelsMutation();
  const [getReservations] = useGetReservationsMutation();
  const [getEntries, { data: entriesData = [] }] = useGetEntriesMutation();
  const [getReservationsLength, { data: reservationsLength = 0 }] =
    useGetReservationsLengthMutation();

  useEffect(() => {
    getRooms({});
    getHostels({});
    getEntries({});
    getReservations({});
    getUsers({ userID: _id });
    getReservationsLength({});
  }, []);

  return (
    <PageLayout extraClassNames='p-4'>
      <h1 className='font-bold text-3xl'>Dashboard</h1>

      <section className='mt-5 bg-swan-white rounded py-2 px-4'>
        <p>Reservation Summary</p>
        <div className='mt-4 flex items-center gap-4 flex-wrap'>
          <ReservationSummaryCard
            title='Check-in'
            value={
              (entriesData as Entry[]).filter(({ type, createdAt }) => {
                const { monthDate } = getDateProps(createdAt);
                return type === 'CHECK_IN' && monthDate === todayDate;
              }).length
            }
          />
          <ReservationSummaryCard
            title='Check-out'
            value={
              (entriesData as Entry[]).filter(({ type, createdAt }) => {
                const { monthDate } = getDateProps(createdAt);
                return type === 'CHECK_OUT' && monthDate === todayDate;
              }).length
            }
          />
          <ReservationSummaryCard value={reservationsLength} title='Confirmed Reservations' />
        </div>

        <section className='mt-5 bg-swan-white rounded py-2 px-4'>
          <div className='flex items-center justify-between'>
            <p>Reservation List</p>
            <PaginationControls page={page!} setPage={setPage!} pages={pages} />
          </div>

          <div>
            {paginatedReservations.length > 0 ? (
              paginatedReservations.map(reservation => <ReservationTab reservation={reservation} />)
            ) : (
              <div className='mt-5 flex flex-col gap-4 items-center justify-center'>
                <MdOutlineBallot className='w-10 h-10' />
                No Reservations made
              </div>
            )}
          </div>
        </section>
      </section>
    </PageLayout>
  );
};

export default Dashboard;
