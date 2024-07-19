import { FaHotel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

import { PATHS } from 'routes/PathConstants';

import VerifyOTP from './VerifyOTP';
import FormInput from 'components/forms/FormInput';
import AuthButton from 'components/forms/AuthButton';

import { useAppSelector } from 'hooks/useRootStorage';
import { useVerifyOtpMutation } from 'services/apis/otpApi';
import { useResetPasswordMutation } from 'services/apis/userApi/userStoreApi';

import { handleReduxQueryError, showAlert } from 'utils';

const ResetPassword = () => {
  const { LOGIN, HOME } = PATHS;

  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { email } = useAppSelector(state => state.userStore.currentUser);
  const [
    resetPassword,
    {
      data: resetData,
      error: resetError,
      isError: isResetError,
      isLoading: isResetLoading,
      isSuccess: isResetSuccess
    }
  ] = useResetPasswordMutation();
  const [
    verifyOtp,
    {
      data: verifiedData,
      error: verifyError,
      isSuccess: isVerified,
      isError: isVerifyError,
      isLoading: isVerifyLoading
    }
  ] = useVerifyOtpMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const password: string = passwordRef.current!.value;
    const confirmPassword: string = confirmPasswordRef.current!.value;

    if (password !== confirmPassword) {
      confirmPasswordRef.current?.focus();
      return showAlert({ msg: 'Passwords must match!' });
    }

    resetPassword({ email, otp, password });
  };

  useEffect(() => {
    if (!email) {
      isAuthenticated ? navigate(HOME) : navigate(LOGIN);
    }
  }, [email, isAuthenticated]);

  useEffect(() => {
    if (verifiedData) showAlert({ msg: verifiedData });
  }, [verifiedData]);

  useEffect(() => {
    if (isResetSuccess) {
      showAlert({ msg: resetData });
      navigate(LOGIN);
    }
  }, [isResetSuccess, resetData]);

  useEffect(() => {
    handleReduxQueryError(isResetError, resetError);
  }, [resetError, isResetError]);

  useEffect(() => {
    handleReduxQueryError(isVerifyError, verifyError, () => setOtp(''));
  }, [verifyError, isVerifyError]);

  return isVerified ? (
    <section className='flex flex-col h-full items-center justify-center'>
      <FaHotel className='w-[100px] h-[100px] text-current' />
      <h1 className='text-2xl font-semibold text-woodsmoke'>Reset Password</h1>

      <form onSubmit={handleSubmit} className='flex flex-col text-woodsmoke'>
        <FormInput
          readOnly
          type='email'
          label='Email'
          value={email}
          inputID='email'
          inputName='email'
          spellCheck={false}
          autoComplete='username'
          extraLabelClassNames='mt-[15px] hidden'
        />

        <FormInput
          required
          type='password'
          label='Password'
          inputID='password'
          inputName='password'
          inputRef={passwordRef}
          placeholder='Enter your new password'
          extraLabelClassNames='mt-[15px]'
        />

        <FormInput
          required
          type='password'
          label='Confirm Password'
          inputID='confirm-password'
          inputName='confirm-password'
          inputRef={confirmPasswordRef}
          placeholder='Confirm your new password'
          extraLabelClassNames='mt-[15px]'
        />

        <AuthButton
          type='submit'
          title='Submit'
          disabled={isResetLoading}
          isLoading={isResetLoading}
        />
      </form>
    </section>
  ) : (
    <VerifyOTP
      otp={otp}
      setOtp={setOtp}
      verifyOtp={verifyOtp}
      isVerifyLoading={isVerifyLoading}
      mailSubject='Password Reset Request for Nest Mate'
    />
  );
};

export default ResetPassword;
