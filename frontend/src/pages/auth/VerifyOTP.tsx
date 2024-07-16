import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';

import OtpInput from 'components/forms/OtpInput';
import { AuthContext } from 'layouts/AuthLayout';
import AuthButton from 'components/forms/AuthButton';

import { PATHS } from 'routes/PathConstants';
import { useAppSelector } from 'hooks/useRootStorage';
import { useSendOtpMutation, useVerifyOtpMutation } from 'services/apis/otpApi';

import { showAlert, secondsToMMSS, handleReduxQueryError } from 'utils';

const VerifyOTP = () => {
  const THREE_MINUTES = 3 * 60;
  const { LOGIN, HOME } = PATHS;
  const { onOtpValidated, mailSubject } = useContext(AuthContext);

  const navigate = useNavigate();
  const [otp, setOtp] = useState<string>('');
  const [counter, setCounter] = useState<number>(THREE_MINUTES);
  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { email, emailValidated } = useAppSelector(state => state.userStore.currentUser);

  useEffect(() => {
    if (!email) navigate(LOGIN);
    if (emailValidated) {
      isAuthenticated ? navigate(HOME) : navigate(LOGIN);
    }
  }, [emailValidated, isAuthenticated, email]);

  const [
    sendOtp,
    { error: otpError, isError: isOtpError, isLoading: isOtpLoading, isSuccess: isOtpSent }
  ] = useSendOtpMutation();

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
    if (isOtpSent) setCounter(THREE_MINUTES);
    else sendOtp({ to: email, subject: mailSubject });
  }, [isOtpSent]);

  useEffect(() => {
    if (isVerified) {
      showAlert({ msg: verifiedData });
      onOtpValidated?.();
    }
  }, [isVerified]);

  useEffect(() => {
    if (counter === 0 || !isOtpSent) return;

    const timer = setInterval(() => setCounter(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [counter, isOtpSent]);

  useEffect(() => {
    handleReduxQueryError(isOtpError, otpError);
  }, [otpError, isOtpError]);

  useEffect(() => {
    handleReduxQueryError(isVerifyError, verifyError, () => setOtp(''));
  }, [verifyError, isVerifyError]);

  return (
    <section className='max-w-[400px] mx-auto flex flex-col h-full items-center justify-center'>
      <div className='flex flex-col h-full items-center justify-center'>
        <h1 className='text-2xl font-semibold mb-10 text-woodsmoke'>
          Please enter the OTP sent to
          <span className='text-lightning-yellow-900 italic'> {email}</span>
        </h1>

        <OtpInput otp={otp} setOtp={setOtp} />
        <AuthButton
          type='submit'
          title='Submit'
          onClick={() => verifyOtp({ email, otp })}
          disabled={isOtpLoading || isVerifyLoading || isVerified}
          isLoading={isOtpLoading || isVerifyLoading || isVerified}
        />

        <AuthButton
          type='button'
          disabled={counter > 0 || isOtpLoading}
          onClick={() => sendOtp({ to: email, subject: mailSubject })}
          title={
            counter > 0 && isOtpSent ? `Resend OTP in ${secondsToMMSS(counter)}` : 'Resend OTP'
          }
          extraClassNames='!bg-transparent !text-lightning-yellow-900 border-transparent shadow-none !w-fit'
        />
      </div>
    </section>
  );
};

export default VerifyOTP;
