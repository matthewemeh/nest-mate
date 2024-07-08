import { useEffect } from 'react';
import { FaBed } from 'react-icons/fa';
import { useParams } from 'react-router-dom';

import { showAlert } from 'utils';

import RoomTab from 'components/RoomTab';

import { useGetHostelMutation } from 'services/apis/hostelApi/hostelStoreApi';

const HostelRooms = () => {
  const { id } = useParams();
  const [getHostel, { data, error, isError }] = useGetHostelMutation();

  useEffect(() => {
    getHostel({ _id: id! });
  }, [id]);

  useEffect(() => {
    if (isError && error && 'status' in error) {
      showAlert({ msg: `${error.data ?? ''}` });
      console.error(error);
    }
  }, [error, isError]);

  return (
    <div>
      <h1 className='font-bold text-3xl'>
        Rooms{data ? ` in ${(data as Hostel).name} hostel` : ''}
      </h1>

      <section className='mt-5 bg-swan-white rounded py-2 px-4'>
        {data ? (
          (data as Hostel).rooms.map(room => <RoomTab room={room} />)
        ) : (
          <div className='flex flex-col gap-4 items-center justify-center'>
            <FaBed className='w-10 h-10' />
            No Rooms Available
          </div>
        )}
      </section>
    </div>
  );
};

export default HostelRooms;
