import { FaHotel } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import HostelTab from 'components/HostelTab';
import Button from 'components/buttons/Button';
import PaginationControls from 'components/PaginationControls';

import useAdmin from 'hooks/useAdmin';
import { useAppSelector } from 'hooks/useRootStorage';
import { useGetHostelsMutation } from 'services/apis/hostelApi/hostelStoreApi';

import { PATHS } from 'routes/PathConstants';
import { handleReduxQueryError } from 'utils';

const Hostels = () => {
  const MIN_PAGE_INDEX = 1;
  const { ADD_HOSTEL } = PATHS;

  const isAdmin = useAdmin();
  const navigate = useNavigate();
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);
  const { pages, paginatedHostels } = useAppSelector(state => state.hostelStore);

  const [getHostels, { error, isError }] = useGetHostelsMutation();

  useEffect(() => {
    getHostels({ params: { page, limit } });
  }, [page]);

  useEffect(() => setPage(MIN_PAGE_INDEX), [limit]);

  useEffect(() => {
    handleReduxQueryError(isError, error);
  }, [error, isError]);

  return (
    <div>
      <h1 className='font-bold text-3xl'>Hostels</h1>

      <section className='mt-5 bg-swan-white rounded py-5 px-4'>
        <div className='mb-5 flex items-center justify-between'>
          {isAdmin && paginatedHostels.length > 0 && (
            <Button content='Add Hostel' onClick={() => navigate(ADD_HOSTEL)} />
          )}
          <PaginationControls
            page={page}
            pages={pages}
            setPage={setPage}
            extraClassNames='ml-auto'
          />
        </div>

        {paginatedHostels.length > 0 && (
          <div className='grid grid-cols-[repeat(2,1fr)_auto] px-4 py-2.5 bg-lightning-yellow-100 rounded'>
            <p>Hostel Name</p>
            <p>Number of Rooms</p>
          </div>
        )}

        <div className='flex flex-col gap-3 mt-4'>
          {paginatedHostels.length > 0 ? (
            paginatedHostels.map(hostel => <HostelTab key={hostel._id} hostel={hostel} />)
          ) : (
            <div className='flex flex-col gap-4 items-center justify-center'>
              <FaHotel className='w-10 h-10' />
              No Hostels Available
              {isAdmin && <Button content='Add Hostel' onClick={() => navigate(ADD_HOSTEL)} />}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Hostels;
