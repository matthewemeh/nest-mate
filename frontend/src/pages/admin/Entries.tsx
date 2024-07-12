import { FiUserX } from 'react-icons/fi';
import { useEffect, useMemo, useState } from 'react';

import { handleReduxQueryError } from 'utils';

import { useGetEntriesMutation } from 'services/apis/entryApi';

import EntryTab from 'components/EntryTab';
import EntriesHeader from 'components/EntriesHeader';
import PaginationControls from 'components/PaginationControls';

const Entries = () => {
  const MIN_PAGE_INDEX = 1;

  const [pages, setPages] = useState<number>(-1);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(MIN_PAGE_INDEX);

  const [getEntries, { data = {}, error, isError, isLoading }] = useGetEntriesMutation();
  const entries: Entry[] = useMemo(() => {
    const paginatedData = data as PaginatedResponse<Entry>;
    return paginatedData.docs;
  }, [data]);

  useEffect(() => {
    getEntries({ params: { page, limit } });
  }, [page]);

  useEffect(() => {
    const paginatedData = data as PaginatedResponse<Entry>;
    setPages(paginatedData.pages);
  }, [data]);

  useEffect(() => {
    handleReduxQueryError(isError, error);
  }, [error, isError]);

  return (
    <div>
      <h1 className='font-bold text-3xl'>Entries</h1>

      <section className='mt-5 bg-swan-white rounded py-5 px-4'>
        <div className='mb-5 flex items-center justify-between'>
          <PaginationControls
            page={page}
            pages={pages}
            setPage={setPage}
            extraClassNames='ml-auto'
          />
        </div>

        {entries?.length > 0 && <EntriesHeader />}

        <ul className='flex flex-col gap-4 mt-4'>
          {entries?.length > 0 ? (
            entries.map(entry => (
              <li key={entry._id} className='border-t border-lightning-yellow-700 last:border-b'>
                <EntryTab entry={entry} />
              </li>
            ))
          ) : (
            <div className='flex flex-col gap-4 items-center justify-center'>
              <FiUserX className='w-10 h-10' />
              No Entries available
            </div>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Entries;
