import { useMemo } from 'react';
import { getDateProps } from 'utils';

interface Props {
  entry: Entry;
}

const EntryTab: React.FC<Props> = ({ entry }) => {
  const {
    type,
    roomID: { roomNumber },
    hostelID: { name: hostelName },
    userID: { lastCheckedIn, lastCheckedOut, checkedIn, name: userName }
  } = entry;

  const { shortMonthName, monthDate, year, hour12, minutes, am_or_pm } = useMemo<DateProps>(
    () => getDateProps(checkedIn ? lastCheckedIn : lastCheckedOut),
    [checkedIn, lastCheckedIn, lastCheckedOut]
  );

  return (
    <div className='grid items-center grid-cols-[repeat(5,minmax(0,1fr))] gap-4 px-4 py-2'>
      <p className='overflow-hidden whitespace-nowrap text-ellipsis'>{userName}</p>
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
