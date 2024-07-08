import { useAppSelector } from 'hooks/useRootStorage';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

interface Props {
  page: number;
  pages: number;
  minPageIndex?: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PaginationControls: React.FC<Props> = ({ page, pages, setPage, minPageIndex = 1 }) => {
  const { prefersDarkMode } = useAppSelector(state => state.userData);

  return (
    <header className='flex mb-5 items-center justify-between gap-3'>
      {pages > 0 && (
        <div className='ml-auto flex items-center gap-7'>
          <button
            disabled={page === minPageIndex}
            onClick={() => setPage(prev => prev - 1)}
            className={`flex items-center justify-between gap-3 bg-lightning-yellow-700 text-zircon rounded-3xl py-2 px-4 ease-in-out duration-300 disabled:cursor-not-allowed disabled:opacity-70 ${
              prefersDarkMode && 'dark:bg-zircon dark:text-nile-blue-900'
            }`}>
            <FaArrowLeft />
            Previous
          </button>
          <button
            disabled={page === pages}
            onClick={() => setPage(prev => prev + 1)}
            className={`flex items-center justify-between gap-3 bg-lightning-yellow-700 text-zircon rounded-3xl py-2 px-4 ease-in-out duration-300 disabled:cursor-not-allowed disabled:opacity-70 ${
              prefersDarkMode && 'dark:bg-zircon dark:text-nile-blue-900'
            }`}>
            Next
            <FaArrowRight />
          </button>
        </div>
      )}
    </header>
  );
};

export default PaginationControls;
