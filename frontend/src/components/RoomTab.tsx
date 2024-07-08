import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from './buttons/Button';

import { useAppSelector } from 'hooks/useRootStorage';
import { useReserveSpaceMutation } from 'services/apis/userApi/userStoreApi';

import { showAlert } from 'utils';

interface Props {
  room: Room;
}

const RoomTab: React.FC<Props> = ({ room }) => {
  const navigate = useNavigate();
  const [
    reserveSpace,
    {
      error: reserveError,
      isError: isReserveError,
      isLoading: isReserveLoading,
      isSuccess: isReserveSuccess
    }
  ] = useReserveSpaceMutation();
  const { roomNumber, floor, hostelID, occupants, _id: roomID } = room;
  const {
    reservationID,
    roomID: userRoomID,
    role,
    _id: userID
  } = useAppSelector(state => state.userStore.currentUser);

  useEffect(() => {
    if (isReserveSuccess) {
      showAlert({ msg: `You have applied for a space in room ${roomNumber}` });
    }
  }, [isReserveSuccess]);

  useEffect(() => {
    if (isReserveError && reserveError && 'status' in reserveError) {
      showAlert({ msg: `${reserveError.data ?? ''}` });
      console.error(reserveError);
    }
  }, [reserveError, isReserveLoading]);

  return (
    <div className='flex items-center justify-between'>
      <p>{roomNumber}</p>
      <p>{floor}</p>
      <p>{occupants.length}</p>
      {role === 'USER' ? (
        <Button
          content='Reserve Space'
          onClick={() => reserveSpace({ userID, roomID })}
          disabled={reservationID.length > 0 || (userRoomID !== undefined && userRoomID.length > 0)}
        />
      ) : (
        <Button
          content='Edit Room'
          onClick={() => navigate(`/hostels/${hostelID}/rooms/${roomID}`)}
        />
      )}
    </div>
  );
};

export default RoomTab;
