import { useEffect } from 'react';

import { useAppSelector } from 'hooks/useRootStorage';
import {
  useConfirmReservationMutation,
  useDeclineReservationMutation
} from 'services/apis/userApi/userStoreApi';

import Button from './buttons/Button';

import { showAlert } from 'utils';

interface Props {
  reservation: Reservation;
}

const ReservationTab: React.FC<Props> = ({ reservation }) => {
  const { roomID, userID, _id } = reservation;
  const { allUsers } = useAppSelector(state => state.userStore);
  const { allRooms } = useAppSelector(state => state.roomStore);
  const { allHostels } = useAppSelector(state => state.hostelStore);

  const { name: userName } = allUsers.find(({ _id }) => _id === userID) ?? {};
  const { name: hostelName } = allHostels.find(({ _id }) => _id === hostelID) ?? {};
  const { roomNumber, hostelID, maxOccupants, occupants } =
    allRooms.find(({ _id }) => _id === roomID) ?? {};

  const [
    confirmReservation,
    { error: confirmError, isError: isConfirmError, isLoading: isConfirmLoading }
  ] = useConfirmReservationMutation();
  const [
    declineReservation,
    { error: declineError, isError: isDeclineError, isLoading: isDeclineLoading }
  ] = useDeclineReservationMutation();

  useEffect(() => {
    if (isConfirmError && confirmError && 'status' in confirmError) {
      showAlert({ msg: `${confirmError.data ?? ''}` });
      console.error(confirmError);
    }
  }, [confirmError, isConfirmError]);

  useEffect(() => {
    if (isDeclineError && declineError && 'status' in declineError) {
      showAlert({ msg: `${declineError.data ?? ''}` });
      console.error(declineError);
    }
  }, [declineError, isDeclineError]);

  return (
    <div className='grid grid-cols-[1fr_0.8fr_50px_50px_50px_auto_auto]'>
      <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{userName}</p>
      <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{hostelName}</p>
      <p>{roomNumber}</p>
      <p>{maxOccupants}</p>
      <p>{occupants?.length ?? 0}</p>
      <Button content='Confirm' onClick={() => confirmReservation({ reservationID: _id })} />
      <Button
        type='outline'
        content='Decline'
        onClick={() => declineReservation({ reservationID: _id })}
      />
    </div>
  );
};

export default ReservationTab;
