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
  const { hostelID, roomID, userID, _id: reservationID } = reservation;
  const { _id: adminID } = useAppSelector(state => state.userStore.currentUser);

  const { name: userName } = userID;
  const { name: hostelName } = hostelID;
  const { roomNumber, maxOccupants, occupants } = roomID;

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
      <Button
        content='Confirm'
        disabled={isConfirmLoading}
        onClick={() => confirmReservation({ reservationID, adminID })}
      />
      <Button
        type='outline'
        content='Decline'
        disabled={isDeclineLoading}
        onClick={() => declineReservation({ reservationID, adminID })}
      />
    </div>
  );
};

export default ReservationTab;
