import { useRef } from 'react';
import { MdLocalLibrary } from 'react-icons/md';
import { useNavigate, Link } from 'react-router-dom';

import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { PATHS } from 'routes/PathConstants';
import { useAppDispatch } from 'hooks/useRootStorage';
import { updateUser } from 'services/apis/userApi/userStoreSlice';

const ForgotPassword = () => {
  const { LOGIN, VERIFY_OTP } = PATHS;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const email: string = emailRef.current!.value;
    dispatch(updateUser({ email }));
    navigate(VERIFY_OTP);
  };

  return (
    <section className='flex flex-col h-full items-center justify-center'>
      <MdLocalLibrary className='w-[100px] h-[100px] text-current' />
      <h1 className='text-2xl font-semibold'>Forgot Password</h1>

      <form onSubmit={handleSubmit} className='flex flex-col'>
        <FormInput
          required
          autoFocus
          type='email'
          label='Email'
          inputID='email'
          inputName='email'
          spellCheck={false}
          inputRef={emailRef}
          autoComplete='username'
          extraLabelClassNames='mt-[15px]'
        />

        <AuthButton type='submit' title='Submit' />
        <span className='text-[15px] leading-5 text-center mt-2'>
          Already have an account?{' '}
          <Link to={LOGIN} className='underline text-nile-blue-700'>
            Sign in
          </Link>
        </span>
      </form>
    </section>
  );
};

export default ForgotPassword;
