import { useRef } from 'react';
import { FaHotel } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { PATHS } from 'routes/PathConstants';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';
import { updateUser } from 'services/apis/userApi/userStoreSlice';

const ForgotPassword = () => {
  const { LOGIN, RESET_PASSWORD } = PATHS;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement>(null);

  const { email } = useAppSelector(state => state.userStore.currentUser);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const email: string = emailRef.current!.value;
    dispatch(updateUser({ email }));
    navigate(RESET_PASSWORD);
  };

  return (
    <section className='flex flex-col h-full items-center justify-center'>
      <FaHotel className='w-[100px] h-[100px] text-current' />
      <h1 className='text-2xl font-semibold text-woodsmoke'>Forgot Password</h1>

      <form onSubmit={handleSubmit} className='flex flex-col text-woodsmoke'>
        <FormInput
          required
          autoFocus
          type='email'
          label='Email'
          inputID='email'
          inputName='email'
          spellCheck={false}
          inputRef={emailRef}
          defaultValue={email}
          autoComplete='username'
          extraLabelClassNames='mt-[15px]'
        />

        <AuthButton type='submit' title='Submit' />
        <span className='text-[15px] leading-5 text-center mt-2'>
          Already have an account?
          <Link to={LOGIN} className='ml-1.5 underline text-lightning-yellow-700'>
            Sign in
          </Link>
        </span>
      </form>
    </section>
  );
};

export default ForgotPassword;
