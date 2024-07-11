const ReservationsHeader = () => {
  return (
    <div className='grid gap-4 grid-cols-[repeat(5,minmax(0,1fr))_82.5469px_80.3438px] px-4 py-2.5 bg-lightning-yellow-100 rounded'>
      <p>Username</p>
      <p>Hostel Name</p>
      <p>Room Number</p>
      <p>Max Occupants</p>
      <p>Occupants</p>
    </div>
  );
};

export default ReservationsHeader;
