import { useParams } from 'react-router-dom';

const HostelRoom = () => {
  const { hostelID, roomID } = useParams();

  return (
    <div>
      Hostel {hostelID} Room{roomID}
    </div>
  );
};

export default HostelRoom;
