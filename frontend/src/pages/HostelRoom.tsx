import { FaUserSlash } from 'react-icons/fa6';
import { Rating } from 'react-simple-star-rating';
import { MdOutlineStarOutline } from 'react-icons/md';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { handleReduxQueryError, showAlert } from 'utils';

import useAdmin from 'hooks/useAdmin';
import { useAppSelector } from 'hooks/useRootStorage';
import { useGetRatingMutation, useUpdateRatingMutation } from 'services/apis/ratingApi';
import { useGetRoomMutation, useDeleteRoomMutation } from 'services/apis/roomApi/roomStoreApi';

import RatingTab from 'components/RatingTab';
import Button from 'components/buttons/Button';
import OccupantTab from 'components/OccupantTab';
import OccupantTabAdmin from 'components/OccupantTabAdmin';

const HostelRoom = () => {
  const isAdmin = useAdmin();
  const navigate = useNavigate();
  const { hostelID, roomID } = useParams();
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);

  const [
    deleteRoom,
    {
      error: deleteError,
      isError: isDeleteError,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess
    }
  ] = useDeleteRoomMutation();

  const [getRoom, { data: room = {}, error: getError, isError: isGetError }] = useGetRoomMutation();
  const { ratings = [], occupants = [], roomNumber } = useMemo(() => room as Room, [room]);

  const [getRating, { data: rating = {} }] = useGetRatingMutation();
  const [setRating, { error: ratingError, isError: isRatingError, isSuccess: isRatingSuccess }] =
    useUpdateRatingMutation();
  const { value = 0 } = useMemo(() => rating as Rating, [rating]);

  const handleDeleteRoom = useCallback(() => {
    const isDeletedConfirmed = window.confirm(
      `Deleting Room ${roomNumber} will evict all users from this hostel alongside any trace of the room. Proceed?`
    );
    if (isDeletedConfirmed) {
      deleteRoom({ _id: roomID!, hostelID: hostelID!, userID });
    }
  }, [roomNumber]);

  const handleRating = (rate: number) => {
    setRating({ userID, value: rate, roomID: roomID!, hostelID: hostelID! });
  };

  useEffect(() => {
    getRoom({ _id: roomID! });
    getRating({ userID, roomID: roomID! });
  }, [roomID]);

  useEffect(() => {
    handleReduxQueryError(isDeleteError, deleteError);
  }, [deleteError, isDeleteError]);

  useEffect(() => {
    handleReduxQueryError(isGetError, getError);
  }, [getError, isGetError]);

  useEffect(() => {
    handleReduxQueryError(isRatingError, ratingError);
  }, [ratingError, isRatingError]);

  useEffect(() => {
    if (isRatingSuccess) {
      showAlert({ msg: 'Rating updated successfully' });
    }
  }, [isRatingSuccess]);

  useEffect(() => {
    if (isDeleteSuccess) {
      showAlert({ msg: 'Room deleted successfully' });
      navigate(`/hostels/${hostelID}/rooms`);
    }
  }, [isDeleteSuccess]);

  return (
    <div>
      <h1 className='text-3xl font-bold mt-2'>
        Occupants{roomNumber ? ` in Room ${roomNumber}` : ''}
      </h1>

      <section className='mod-1 mt-5 bg-swan-white rounded py-5 px-4'>
        <div className='mb-5 flex items-center justify-between'>
          {isAdmin && (
            <Button
              id='delete-button'
              content='Delete Room'
              disabled={isDeleteLoading}
              onClick={handleDeleteRoom}
              extraClassNames='!bg-red-600'
            />
          )}

          <div className='flex flex-col items-center justify-center mx-auto'>
            <p className='font-semibold text-lg'>Rate this room</p>
            <Rating
              transition
              allowFraction
              disableFillHover
              initialValue={value}
              SVGclassName='inline'
              onClick={handleRating}
            />
          </div>

          {isAdmin && (
            <Button
              content='Edit Room'
              onClick={() => navigate(`/hostels/${hostelID}/rooms/${roomID}/edit`)}
            />
          )}
        </div>

        <div className='flex flex-col gap-3 mt-4'>
          {occupants.length > 0 ? (
            occupants.map(occupant =>
              isAdmin ? (
                <OccupantTabAdmin
                  roomID={roomID!}
                  key={occupant._id}
                  occupant={occupant}
                  hostelID={hostelID!}
                />
              ) : (
                <OccupantTab key={occupant._id} occupant={occupant} />
              )
            )
          ) : (
            <div className='flex flex-col gap-4 items-center justify-center'>
              <FaUserSlash className='w-10 h-10' />
              No Occupants Available
            </div>
          )}
        </div>
      </section>

      <h2 className='font-bold text-3xl mt-10'>Room Ratings</h2>

      <section className='mod-1 mt-5 bg-swan-white rounded py-5 px-4'>
        <ul className='flex flex-col gap-3 mt-4'>
          {ratings.length > 0 ? (
            ratings.map(rating => <RatingTab key={rating._id} rating={rating} />)
          ) : (
            <div className='flex flex-col gap-4 items-center justify-center'>
              <MdOutlineStarOutline className='w-10 h-10' />
              No Ratings Available
            </div>
          )}
        </ul>
      </section>
    </div>
  );
};

export default HostelRoom;
