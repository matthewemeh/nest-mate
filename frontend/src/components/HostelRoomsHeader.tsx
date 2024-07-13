interface Props {
  isAdmin: boolean;
}

const HostelRoomsHeader: React.FC<Props> = ({ isAdmin }) => {
  return (
    <div
      className={`hostel-rooms-header grid gap-4 px-4 py-2.5 bg-lightning-yellow-100 rounded ${
        isAdmin
          ? 'grid-cols-[repeat(3,minmax(0,1fr))_106.344px]'
          : 'grid-cols-[repeat(3,minmax(0,1fr))_106.344px_128.734px]'
      }`}>
      <p>Room Number</p>
      <p>Room Floor</p>
      <p>No. of Occupants</p>
      <p></p>
      {isAdmin || <p></p>}
    </div>
  );
};

export default HostelRoomsHeader;
