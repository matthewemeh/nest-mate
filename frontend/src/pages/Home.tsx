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
import { FaHotel } from 'react-icons/fa';

const Home = () => {
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
  const [getReservationsLength, { data = 0 }] = useGetReservationsLengthMutation();

  useEffect(() => {
    getRooms({});
    getHostels({});
    getEntries({});
    getReservations({});
    getUsers({ userID: _id });
    getReservationsLength({});
  }, []);

  return <PageLayout extraClassNames='p-4'>Home</PageLayout>;
};

export default Home;
