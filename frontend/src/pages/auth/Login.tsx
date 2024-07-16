import { FaHotel } from 'react-icons/fa';
import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { PATHS } from 'routes/PathConstants';
import { useLoginMutation } from 'services/apis/userApi/userStoreApi';
import { resetUserData, updateUserData } from 'services/userData/userDataSlice';

import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';
import { useAppDispatch } from 'hooks/useRootStorage';
import { updateUser } from 'services/apis/userApi/userStoreSlice';

import { handleReduxQueryError } from 'utils';

const Login = () => {
  const { HOME, FORGOT_PASSWORD, REGISTER } = PATHS;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [login, { error, isError, isLoading, isSuccess }] = useLoginMutation();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const email: string = emailRef.current!.value;
    const password: string = passwordRef.current!.value;

    login({ email, password });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(updateUserData({ isAuthenticated: true }));
      navigate(HOME);
    }
  }, [isSuccess]);

  useEffect(() => {
    handleReduxQueryError(isError, error);
  }, [error, isError]);

  return (
    <div className='flex flex-col h-full items-center justify-center'>
      <FaHotel className='w-[100px] h-[100px] text-current' />
      <h1 className='text-2xl font-semibold text-woodsmoke'>Welcome back</h1>
      <p className='text-base text-woodsmoke'>Please enter your details</p>

      <form onSubmit={handleLogin} className='flex flex-col text-woodsmoke'>
        <FormInput
          required
          autoFocus
          type='text'
          label='Email'
          inputID='email'
          inputName='email'
          spellCheck={false}
          inputRef={emailRef}
          extraLabelClassNames='mt-8'
        />

        <FormInput
          required
          type='password'
          label='Password'
          inputID='password'
          inputName='password'
          inputRef={passwordRef}
          extraLabelClassNames='mt-[15px]'
        />
        <Link
          to={FORGOT_PASSWORD}
          onClick={() => {
            dispatch(updateUser({ _id: '' }));
            dispatch(resetUserData());
          }}
          className='text-right text-lightning-yellow-800 text-sm mt-2 block whitespace-nowrap'>
          Forgot password?
        </Link>

        <AuthButton type='submit' title='Log in' disabled={isLoading} isLoading={isLoading} />
        <span className='text-[15px] leading-5 text-center mt-2 text-woodsmoke'>
          Don't have an account?
          <Link to={REGISTER} className='ml-1.5 underline text-lightning-yellow-800'>
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
