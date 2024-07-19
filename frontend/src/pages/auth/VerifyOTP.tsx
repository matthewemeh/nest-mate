import { useEffect, useState } from 'react';
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  FetchArgs,
  MutationDefinition,
  FetchBaseQueryMeta,
  FetchBaseQueryError
} from '@reduxjs/toolkit/query';

import OtpInput from 'components/forms/OtpInput';
import AuthButton from 'components/forms/AuthButton';

import { useAppSelector } from 'hooks/useRootStorage';
import { useSendOtpMutation } from 'services/apis/otpApi';

import { secondsToMMSS, handleReduxQueryError } from 'utils';

interface Props {
  otp: string;
  mailSubject: string;
  isVerifyLoading: boolean;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  verifyOtp: MutationTrigger<
    MutationDefinition<
      VerifyOtpPayload,
      BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, {}, FetchBaseQueryMeta>,
      never,
      any,
      'otpApi'
    >
  >;
}

const VerifyOTP: React.FC<Props> = ({ otp, setOtp, verifyOtp, mailSubject, isVerifyLoading }) => {
  const THREE_MINUTES = 3 * 60;

  const [counter, setCounter] = useState<number>(THREE_MINUTES);
  const { email } = useAppSelector(state => state.userStore.currentUser);

  const [
    sendOtp,
    { error: otpError, isError: isOtpError, isLoading: isOtpLoading, isSuccess: isOtpSent }
  ] = useSendOtpMutation();

  useEffect(() => {
    sendOtp({ to: email, subject: mailSubject });
  }, []);

  useEffect(() => {
    if (isOtpSent) setCounter(THREE_MINUTES);
  }, [isOtpSent]);

  useEffect(() => {
    if (counter === 0 || !isOtpSent) return;

    const timer = setInterval(() => setCounter(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [counter, isOtpSent]);

  useEffect(() => {
    handleReduxQueryError(isOtpError, otpError);
  }, [otpError, isOtpError]);

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
          disabled={isOtpLoading || isVerifyLoading}
          isLoading={isOtpLoading || isVerifyLoading}
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
