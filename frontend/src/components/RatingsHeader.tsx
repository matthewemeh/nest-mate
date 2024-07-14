interface Props {
  view?: 'ROOM' | 'USER';
}

const RatingsHeader: React.FC<Props> = ({ view = 'ROOM' }) => {
  return (
    <div
      className={`grid gap-4 px-4 py-2.5 bg-lightning-yellow-100 text-woodsmoke rounded ${
        view === 'USER' ? 'grid-cols-4' : 'grid-cols-2'
      }`}>
      <p>Username</p>
      {view === 'USER' && (
        <>
          <p>Hostel Name</p>
          <p>Room Number</p>
        </>
      )}
      <p>Rating</p>
    </div>
  );
};

export default RatingsHeader;
