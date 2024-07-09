import { Link } from 'react-router-dom';
import { PiCaretRightBold } from 'react-icons/pi';

interface Props {
  hostel: Hostel;
}

const HostelTab: React.FC<Props> = ({ hostel }) => {
  const { _id, name, rooms } = hostel;

  return (
    <Link
      to={`/hostels/${_id}/rooms`}
      className='grid grid-cols-[1fr_1fr_auto] px-4 py-2.5 bg-lightning-yellow-100 rounded'>
      <p>{name}</p>
      <p>{rooms.length}</p>
      <PiCaretRightBold className='self-center' />
    </Link>
  );
};

export default HostelTab;
