import { useParams } from 'react-router-dom';

const HostelRoom = () => {
  const { hostelID, roomID } = useParams();

  return <div>HostelRoom</div>;
};

export default HostelRoom;
