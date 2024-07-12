import { useMemo } from 'react';

import { getDateProps } from 'utils';

import { useAppSelector } from 'hooks/useRootStorage';

interface Props {
  entry: Entry;
}

const EntryTab: React.FC<Props> = ({ entry }) => {
  const {
    type,
    roomID: { roomNumber },
    hostelID: { name: hostelName },
    userID: { _id, lastCheckedIn, lastCheckedOut, checkedIn, name: userName }
  } = entry;
  const { _id: userID } = useAppSelector(state => state.userStore.currentUser);

  const isYou = useMemo(() => _id === userID, [_id, userID]);
  const { shortMonthName, monthDate, year, hour12, minutes, am_or_pm } = useMemo<DateProps>(
    () => getDateProps(checkedIn ? lastCheckedIn : lastCheckedOut),
    [checkedIn, lastCheckedIn, lastCheckedOut]
  );

  return (
    <div className='grid items-center grid-cols-[repeat(5,minmax(0,1fr))] gap-4 px-4 py-2'>
      <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{isYou ? 'You' : userName}</p>
      <p>{hostelName}</p>
      <p>{roomNumber}</p>
      <p>{type}</p>
      <p>
        {shortMonthName} {monthDate}, {year} {hour12.toString().padStart(2, '0')}:{minutes}{' '}
        {am_or_pm.toUpperCase()}
      </p>
    </div>
  );
};

export default EntryTab;
