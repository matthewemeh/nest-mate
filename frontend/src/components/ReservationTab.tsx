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
  const { hostelID, roomID, userID, status, _id: reservationID } = reservation;
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
    <div
      className={`grid gap-4 px-4 ${
        status === 'PENDING'
          ? 'grid-cols-[repeat(5,minmax(0,1fr))_auto_auto]'
          : 'grid-cols-[repeat(5,minmax(0,1fr))_auto]'
      }`}>
      <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{userName}</p>
      <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{hostelName}</p>
      <p>{roomNumber}</p>
      <p>{maxOccupants}</p>
      <p>{occupants?.length ?? 0}</p>
      {status === 'PENDING' ? (
        <>
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
        </>
      ) : (
        <p className='text-lightning-yellow-400 font-semibold'>{status}</p>
      )}
    </div>
  );
};

export default ReservationTab;
