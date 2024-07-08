import { useNavigate } from 'react-router-dom';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import OtpInput from 'components/forms/OtpInput';
import AuthButton from 'components/forms/AuthButton';

import { PATHS } from 'routes/PathConstants';
import { AuthContext } from 'layouts/AuthLayout';
import { useAppSelector } from 'hooks/useRootStorage';
import { useSendEmailMutation } from 'services/apis/emailApi';
import { decryptString, generateOTP, secondsToMMSS, showAlert, validateOTP } from 'utils';

const VerifyOTP = () => {
  const NUMBER_OF_DIGITS = 6;
  const THREE_MINUTES = 3 * 60;
  const { LOGIN, HOME } = PATHS;
  const FIVE_MINUTES = 5 * 60 * 1000;
  const { OTP_DETAILS_KEY, onOtpValidated, mailPretext, mailSubject } = useContext(AuthContext);

  const navigate = useNavigate();
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpDetails, setOtpDetails] = useState<OtpDetails>();
  const [counter, setCounter] = useState<number>(THREE_MINUTES);
  const generatedOtp: string | undefined = useMemo(() => otpDetails?.otp, [otpDetails]);
  const encryptedOtp: string | undefined = useMemo(() => otpDetails?.encryptedOtp, [otpDetails]);

  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { email, emailValidated } = useAppSelector(state => state.userStore.currentUser);

  const setStoredOtp = () => {
    const newGeneratedOtp: OtpDetails = generateOTP(NUMBER_OF_DIGITS);
    const newOtpDetails: StoredOtpDetails = {
      otp: newGeneratedOtp.encryptedOtp,
      expiresAt: Date.now() + FIVE_MINUTES
    };
    setOtpDetails(newGeneratedOtp);
    localStorage.setItem(OTP_DETAILS_KEY!, JSON.stringify(newOtpDetails));
  };

  const initOtpDetails = useCallback(
    (refresh?: boolean) => {
      if (!email) navigate(LOGIN);
      if (emailValidated) {
        isAuthenticated ? navigate(HOME) : navigate(LOGIN);
      }

      // check localStorage for otp details first
      const storedOtpDetails: StoredOtpDetails = JSON.parse(
        localStorage.getItem(OTP_DETAILS_KEY!) ?? `{ "otp": "", "expiresAt": "" }`
      );
      if (!refresh && storedOtpDetails.otp) {
        const hasNotExpired: boolean = storedOtpDetails.expiresAt > Date.now();
        if (hasNotExpired) {
          const { otp } = storedOtpDetails;
          setOtpDetails({ encryptedOtp: otp, otp: decryptString(otp) });
        } else {
          setStoredOtp();
        }
      } else {
        setStoredOtp();
      }
    },
    [email, emailValidated]
  );

  useEffect(() => initOtpDetails(), [emailValidated, isAuthenticated, email]);

  const [
    sendEmail,
    { error: otpError, isError: isOtpError, isLoading: isOtpLoading, isSuccess: isOtpSent }
  ] = useSendEmailMutation();

  const mailText = useMemo<string>(() => {
    return `${mailPretext}\nYour OTP is: ${generatedOtp}\n\nBest regards,\nE-Library,\nYour one-stop center for the latest books`;
  }, [generatedOtp]);

  const handleSubmitOTP = () => {
    if (encryptedOtp) {
      const isOtpValidated: boolean = validateOTP(enteredOtp, encryptedOtp);
      if (isOtpValidated) {
        onOtpValidated?.();
      } else {
        showAlert({ msg: 'Wrong OTP provided!' });
        setEnteredOtp('');
      }
    }
  };

  useEffect(() => {
    if (generatedOtp) sendEmail({ to: email, subject: mailSubject, text: mailText });
  }, [generatedOtp]);

  useEffect(() => {
    if (isOtpError && otpError && 'status' in otpError) {
      showAlert({ msg: `${otpError.data ?? ''}` });
      console.error(otpError);
    }
  }, [otpError, isOtpError]);

  useEffect(() => {
    if (isOtpSent) setCounter(THREE_MINUTES);
  }, [isOtpSent]);

  useEffect(() => {
    if (counter === 0 || !isOtpSent) return;

    const timer = setInterval(() => setCounter(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [counter, isOtpSent]);

  return (
    <section className='max-w-[400px] mx-auto flex flex-col h-full items-center justify-center'>
      <div className='flex flex-col h-full items-center justify-center'>
        <h1 className='text-2xl font-semibold mb-10'>
          Please enter the OTP sent to
          <span className='text-nile-blue-950 italic'> {email}</span>
        </h1>

        <OtpInput otp={enteredOtp} setOtp={setEnteredOtp} numberOfDigits={NUMBER_OF_DIGITS} />
        <AuthButton
          type='submit'
          title='Submit'
          disabled={isOtpLoading}
          isLoading={isOtpLoading}
          onClick={handleSubmitOTP}
        />

        <AuthButton
          type='button'
          onClick={() => initOtpDetails(true)}
          disabled={counter > 0 || isOtpLoading}
          title={
            counter > 0 && isOtpSent ? `Resend OTP in ${secondsToMMSS(counter)}` : 'Resend OTP'
          }
          extraClassNames='bg-transparent !text-nile-blue-900 border-transparent shadow-none w-fit'
        />
      </div>
    </section>
  );
};

export default VerifyOTP;
