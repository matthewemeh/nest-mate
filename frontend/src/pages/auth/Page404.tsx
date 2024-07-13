import { Link } from 'react-router-dom';
import { PATHS } from 'routes/PathConstants';

const AuthPage404 = () => {
  const { LOGIN } = PATHS;

  return (
    <div className='h-screen flex flex-col flex-1 items-center justify-center'>
      <p className='text-4xl font-medium'>This page does not exist.</p>
      <Link to={LOGIN} className='text-xl underline mt-4'>
        Return to Login
      </Link>
    </div>
  );
};

export default AuthPage404;
