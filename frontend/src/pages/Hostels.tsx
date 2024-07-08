import { FaHotel } from 'react-icons/fa';
import { useEffect, useState } from 'react';

import { showAlert } from 'utils';

import HostelTab from 'components/HostelTab';

import { useAppSelector } from 'hooks/useRootStorage';
import { useGetHostelsMutation } from 'services/apis/hostelApi/hostelStoreApi';

const Hostels = () => {
  const MIN_PAGE_INDEX = 1;
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const { paginatedHostels } = useAppSelector(state => state.hostelStore);
  const [getHostels, { error, isError }] = useGetHostelsMutation();

  useEffect(() => {
    getHostels({ params: { page, limit } });
  }, [page]);

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  useEffect(() => {
    if (isError && error && 'status' in error) {
      showAlert({ msg: `${error.data ?? ''}` });
      console.error(error);
    }
  }, [error, isError]);

  return (
    <div>
      <h1 className='font-bold text-3xl'>Hostels</h1>

      <section className='mt-5 bg-swan-white rounded py-2 px-4'>
        {paginatedHostels.length === 0 ? (
          [
            {
              name: 'En Suite',
              rooms: [],
              floors: 5,
              hostelImageUrl: '',
              _id: '1',
              createdAt: '2024-07-08T13:00:00',
              updatedAt: '2024-07-08T13:00:00'
            }
          ].map(hostel => <HostelTab key={hostel._id} hostel={hostel} />)
        ) : (
          // paginatedHostels.map(hostel => <HostelTab key={hostel._id} hostel={hostel} />)
          <div className='flex flex-col gap-4 items-center justify-center'>
            <FaHotel className='w-10 h-10' />
            No Hostels Available
          </div>
        )}
      </section>
    </div>
  );
};

export default Hostels;
