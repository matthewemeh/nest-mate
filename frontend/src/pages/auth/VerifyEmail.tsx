import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATHS } from 'routes/PathConstants';

import VerifyOTP from './VerifyOTP';

import { useAppSelector } from 'hooks/useRootStorage';
import { useVerifyOtpMutation } from 'services/apis/otpApi';
import { useVerifyEmailMutation } from 'services/apis/userApi/userStoreApi';

import { handleReduxQueryError, showAlert } from 'utils';

const VerifyEmail = () => {
  const { LOGIN, HOME } = PATHS;

  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>('');
  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { email, emailValidated } = useAppSelector(state => state.userStore.currentUser);
  const [
    verifyEmail,
    {
      error: emailError,
      isError: isEmailError,
      isLoading: isEmailLoading,
      isSuccess: isEmailSuccess
    }
  ] = useVerifyEmailMutation();
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

  useEffect(() => {
    if (!email || emailValidated) {
      isAuthenticated ? navigate(HOME) : navigate(LOGIN);
    }
  }, [emailValidated, isAuthenticated, email]);

  useEffect(() => {
    if (isVerified && verifiedData) verifyEmail({ email, otp });
  }, [isVerified, verifiedData]);

  useEffect(() => {
    if (isEmailSuccess) {
      showAlert({ msg: 'Email Verification successful' });
      isAuthenticated ? navigate(HOME) : navigate(LOGIN);
    }
  }, [isEmailSuccess]);

  useEffect(() => {
    handleReduxQueryError(isEmailError, emailError);
  }, [emailError, isEmailError]);

  useEffect(() => {
    handleReduxQueryError(isVerifyError, verifyError, () => setOtp(''));
  }, [verifyError, isVerifyError]);

  return (
    <VerifyOTP
      otp={otp}
      setOtp={setOtp}
      verifyOtp={verifyOtp}
      mailSubject='Email Verification for Nest Mate'
      isVerifyLoading={isVerifyLoading || isEmailLoading}
    />
  );
};

export default VerifyEmail;
