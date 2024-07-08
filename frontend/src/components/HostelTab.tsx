import { Link } from 'react-router-dom';
import { PiCaretRightBold } from 'react-icons/pi';

interface Props {
  hostel: Hostel;
}

const HostelTab: React.FC<Props> = ({ hostel }) => {
  const { _id, name, rooms } = hostel;

  return (
    <Link to={`/hostels/${_id}/rooms`} className='flex items-center justify-between'>
      <p>{name}</p>
      <p>{rooms.length}</p>
      <PiCaretRightBold />
    </Link>
  );
};

export default HostelTab;
