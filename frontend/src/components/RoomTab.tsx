import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Button from './buttons/Button';

import useAdmin from 'hooks/useAdmin';
import { useAppSelector } from 'hooks/useRootStorage';
import { useReserveSpaceMutation } from 'services/apis/userApi/userStoreApi';

import { handleReduxQueryError, showAlert } from 'utils';

interface Props {
  room: Room;
}

const RoomTab: React.FC<Props> = ({ room }) => {
  const navigate = useNavigate();
  const isAdmin: boolean = useAdmin();
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
    _id: userID,
    reservationID,
    roomID: userRoomID
  } = useAppSelector(state => state.userStore.currentUser);

  useEffect(() => {
    if (isReserveSuccess) {
      showAlert({ msg: `You have applied for a space in room ${roomNumber}` });
    }
  }, [isReserveSuccess]);

  useEffect(() => {
    handleReduxQueryError(isReserveError, reserveError);
  }, [reserveError, isReserveError]);

  return (
    <div
      className={`grid gap-4 px-4 ${
        isAdmin
          ? 'grid-cols-[repeat(3,minmax(0,1fr))_auto]'
          : 'grid-cols-[repeat(3,minmax(0,1fr))_auto_auto]'
      }`}>
      <p>{roomNumber}</p>
      <p>{floor}</p>
      <p>{occupants.length}</p>
      <Button
        content='View Room'
        onClick={() => navigate(`/hostels/${hostelID}/rooms/${roomID}`)}
      />
      {isAdmin || (
        <Button
          content='Reserve Space'
          extraClassNames='-mr-4'
          onClick={() => reserveSpace({ userID, roomID, hostelID })}
          disabled={
            isReserveLoading ||
            reservationID.length > 0 ||
            (userRoomID !== undefined && userRoomID?.length > 0)
          }
        />
      )}
    </div>
  );
};

export default RoomTab;
