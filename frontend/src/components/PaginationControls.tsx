import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface Props {
  page: number;
  pages: number;
  minPageIndex?: number;
  extraClassNames?: string;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationControls: React.FC<Props> = ({
  page,
  pages,
  setPage,
  extraClassNames,
  minPageIndex = 1
}) => {
  return (
    <header className={`flex mb-5 items-center justify-between gap-3 ${extraClassNames}`}>
      {pages > 0 && (
        <div className='ml-auto flex items-center gap-7'>
          <button
            disabled={page === minPageIndex}
            onClick={() => setPage(prev => prev - 1)}
            className='pagination-control-button border border-swan-white flex items-center justify-between gap-3 bg-lightning-yellow-700 text-zircon rounded-3xl py-2 px-4 ease-in-out duration-300 disabled:cursor-not-allowed disabled:opacity-50'>
            <FaArrowLeft />
            Previous
          </button>
          <button
            disabled={page === pages}
            onClick={() => setPage(prev => prev + 1)}
            className='pagination-control-button border border-swan-white flex items-center justify-between gap-3 bg-lightning-yellow-700 text-zircon rounded-3xl py-2 px-4 ease-in-out duration-300 disabled:cursor-not-allowed disabled:opacity-50'>
            Next
            <FaArrowRight />
          </button>
        </div>
      )}
    </header>
  );
};

export default PaginationControls;
