import { Link } from 'react-router-dom';
import { PATHS } from 'routes/PathConstants';

const Page404 = () => {
  const { HOME } = PATHS;

  return (
    <div className='h-screen flex flex-col flex-1 items-center justify-center'>
      <p className='text-4xl font-medium'>This page does not exist.</p>
      <Link to={HOME} className='text-xl underline mt-4'>
        Go back home
      </Link>
    </div>
  );
};

export default Page404;
