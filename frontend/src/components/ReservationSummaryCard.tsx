interface Props {
  title: string;
  value: number | string;
}

const ReservationSummaryCard: React.FC<Props> = ({ title, value }) => {
  return (
    <div className='reservation-summary-card bg-swan-white h-fit min-w-[200px] shrink-0 px-2 grid grid-cols-[1fr_auto] gap-x-6 border border-oslo-gray rounded-md'>
      <p className='self-end text-oslo-gray'>Today's</p>
      <p className='text-woodsmoke font-semibold'>{title}</p>
      <p className='self-center text-[45px] font-bold text-lightning-yellow-600 col-start-2 row-start-1 row-end-3'>
        {value}
      </p>
    </div>
  );
};

export default ReservationSummaryCard;
