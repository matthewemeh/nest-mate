import { FaBed } from 'react-icons/fa';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { showAlert } from 'utils';

import RoomTab from 'components/RoomTab';
import Button from 'components/buttons/Button';

import useAdmin from 'hooks/useAdmin';
import {
  useGetHostelMutation,
  useDeleteHostelMutation
} from 'services/apis/hostelApi/hostelStoreApi';
import { useAppSelector } from 'hooks/useRootStorage';

import { PATHS } from 'routes/PathConstants';

const HostelRooms = () => {
  const { HOSTELS } = PATHS;

  const isAdmin = useAdmin();
  const navigate = useNavigate();
  const { hostelID } = useParams();
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);
  const [getHostel, { data: hostel = {}, error: getError, isError: isGetError }] =
    useGetHostelMutation();
  const { rooms = [], name = '' } = useMemo(() => hostel as Hostel, [hostel]);

  const [
    deleteHostel,
    {
      error: deleteError,
      isError: isDeleteError,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess
    }
  ] = useDeleteHostelMutation();

  const handleDeleteHostel = useCallback(() => {
    const isDeletedConfirmed = window.confirm(
      `Deleting ${name} will remove all rooms and will evict all users from this hostel. Proceed?`
    );
    if (isDeletedConfirmed) {
      deleteHostel({ _id: hostelID!, userID });
    }
  }, [name]);

  useEffect(() => {
    getHostel({ _id: hostelID! });
  }, [hostelID]);

  useEffect(() => {
    if (isGetError && getError && 'status' in getError) {
      showAlert({ msg: `${getError.data ?? ''}` });
      console.error(getError);
    }
  }, [getError, isGetError]);

  useEffect(() => {
    if (isDeleteError && deleteError && 'status' in deleteError) {
      showAlert({ msg: `${deleteError.data ?? ''}` });
      console.error(deleteError);
    }
  }, [deleteError, isDeleteError]);

  useEffect(() => {
    if (isDeleteSuccess) {
      showAlert({ msg: 'Hostel deleted successfully' });
      navigate(HOSTELS);
    }
  }, [isDeleteSuccess]);

  return (
    <div>
      <h1 className='font-bold text-3xl'>Rooms {name ? `in ${name}` : ''}</h1>

      <section className='mt-5 bg-swan-white rounded py-5 px-4'>
        {isAdmin && (
          <div className='mb-5 flex items-center justify-between'>
            <Button
              content='Delete Hostel'
              disabled={isDeleteLoading}
              onClick={handleDeleteHostel}
            />
            {rooms.length > 0 && (
              <Button
                content='Add Room'
                onClick={() => navigate(`/hostels/${hostelID}/rooms/add`)}
              />
            )}
          </div>
        )}

        {rooms.length > 0 && (
          <div
            className={`grid gap-4 px-4 py-2.5 bg-lightning-yellow-100 rounded ${
              isAdmin
                ? 'grid-cols-[repeat(3,minmax(0,1fr))_106.344px]'
                : 'grid-cols-[repeat(3,minmax(0,1fr))_106.344px_128.734px]'
            }`}>
            <p>Room Number</p>
            <p>Room Floor</p>
            <p>No. of Occupants</p>
            <p></p>
            {isAdmin || <p></p>}
          </div>
        )}

        <div className='flex flex-col gap-3 mt-4'>
          {rooms.length > 0 ? (
            rooms.map(room => <RoomTab key={room._id} room={room} />)
          ) : (
            <div className='flex flex-col gap-4 items-center justify-center'>
              <FaBed className='w-10 h-10' />
              No Rooms Available
              {isAdmin && (
                <Button
                  content='Add Room'
                  onClick={() => navigate(`/hostels/${hostelID}/rooms/add`)}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HostelRooms;
