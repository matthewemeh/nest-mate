const EntriesHeader = () => {
  return (
    <div className='grid gap-4 grid-cols-[repeat(5,minmax(0,1fr))] px-4 py-2.5 bg-lightning-yellow-100 rounded'>
      <p>Username</p>
      <p>Hostel Name</p>
      <p>Room Number</p>
      <p>Entry Type</p>
      <p>Entry In/Out Time</p>
    </div>
  );
};

export default EntriesHeader;
