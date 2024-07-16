import { useEffect, useMemo } from 'react';

import { useAppSelector } from 'hooks/useRootStorage';
import {
  useConfirmReservationMutation,
  useDeclineReservationMutation
} from 'services/apis/userApi/userStoreApi';

import Button from './buttons/Button';

import { handleReduxQueryError, showAlert } from 'utils';

interface Props {
  reservation: Reservation;
}

const ReservationTab: React.FC<Props> = ({ reservation }) => {
  const { hostelID, roomID, userID, status, _id: reservationID } = reservation;
  const { _id: adminID, token } = useAppSelector(state => state.userStore.currentUser);

  const { name: hostelName } = hostelID;
  const { name: userName, _id } = userID;
  const { roomNumber, maxOccupants, occupants } = roomID;

  const isYou = useMemo(() => _id === adminID, [_id, adminID]);

  const [
    confirmReservation,
    {
      error: confirmError,
      isError: isConfirmError,
      isLoading: isConfirmLoading,
      isSuccess: isConfirmSuccess
    }
  ] = useConfirmReservationMutation();
  const [
    declineReservation,
    {
      error: declineError,
      isError: isDeclineError,
      isLoading: isDeclineLoading,
      isSuccess: isDeclineSuccess
    }
  ] = useDeclineReservationMutation();

  useEffect(() => {
    if (isConfirmSuccess) showAlert({ msg: `${userName}'s reservation confirmed` });
  }, [isConfirmSuccess]);

  useEffect(() => {
    if (isDeclineSuccess) showAlert({ msg: `${userName}'s reservation declined` });
  }, [isDeclineSuccess]);

  useEffect(() => {
    handleReduxQueryError(isConfirmError, confirmError);
  }, [confirmError, isConfirmError]);

  useEffect(() => {
    handleReduxQueryError(isDeclineError, declineError);
  }, [declineError, isDeclineError]);

  return (
    <div className='grid items-center grid-cols-[repeat(5,minmax(0,1fr))_82.5469px_80.3438px] gap-4 px-4 py-2'>
      <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{isYou ? 'You' : userName}</p>
      <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{hostelName}</p>
      <p>{roomNumber}</p>
      <p>{maxOccupants}</p>
      <p>{occupants?.length ?? 0}</p>
      {status === 'PENDING' ? (
        <>
          <Button
            content='Confirm'
            onClick={() => confirmReservation({ reservationID, token })}
            disabled={isConfirmLoading || isConfirmSuccess || isDeclineSuccess}
          />
          <Button
            type='outline'
            content='Decline'
            onClick={() => declineReservation({ reservationID, token })}
            disabled={isDeclineLoading || isConfirmSuccess || isDeclineSuccess}
          />
        </>
      ) : (
        <p className='text-lightning-yellow-400 font-semibold text-right col-start-6 col-end-8'>
          {status}
        </p>
      )}
    </div>
  );
};

export default ReservationTab;
