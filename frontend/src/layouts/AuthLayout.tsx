import { Outlet, useNavigate } from 'react-router-dom';
import { createContext, Suspense, useCallback, useEffect, useMemo } from 'react';

import Loading from 'components/Loading';
import { PATHS } from 'routes/PathConstants';
import { updateUserData } from 'services/userData/userDataSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';
import { useUpdateUserMutation } from 'services/apis/userApi/userStoreApi';

import { handleReduxQueryError, showAlert } from 'utils';

export const AuthContext = createContext<Partial<AuthContext>>({});

const AuthLayout = () => {
  const OTP_DETAILS_KEY = 'otpDetails';
  const { HOME, LOGIN, RESET_PASSWORD } = PATHS;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { _id, name } = useAppSelector(state => state.userStore.currentUser);
  const mailPretext = useMemo<string>(() => {
    if (_id) {
      return `Dear ${name},\nWelcome to Nest Mate! To complete your registration, please enter the OTP down below to verify your email.\nIf you did not create an account with us, please disregard this email. Your privacy is important to us.`;
    } else {
      return `Dear User,\nWe have received a request to reset your password on our platform. If this was you, please enter the OTP below to set a new password.`;
    }
  }, [name, _id]);

  const mailSubject = useMemo(() => {
    if (_id) {
      return 'Email Verification for Nest Mate';
    } else {
      return 'Password Reset Request for Nest Mate';
    }
  }, [_id]);

  const [updateUser, { error: userUpdateError, isError: isUserUpdateError }] =
    useUpdateUserMutation();

  const onOtpValidated = useCallback(
    _id
      ? () => {
          // for validating email
          updateUser({ _id, userID: _id, emailValidated: true });
          localStorage.removeItem(OTP_DETAILS_KEY);
          showAlert({ msg: 'Email Verification successful' });
          setTimeout(() => {
            isAuthenticated ? navigate(HOME) : navigate(LOGIN);
          }, 2000);
        }
      : () => {
          // for resetting password
          dispatch(updateUserData({ isOtpVerified: true }));
          localStorage.removeItem(OTP_DETAILS_KEY);
          setTimeout(() => navigate(RESET_PASSWORD), 2000);
        },
    [isAuthenticated, _id]
  );

  useEffect(() => {
    handleReduxQueryError(isUserUpdateError, userUpdateError);
  }, [userUpdateError, isUserUpdateError]);

  return (
    <main className='h-screen grid grid-cols-2'>
      <div></div>
      <div className='bg-swan-white text-nile-blue-900'>
        <AuthContext.Provider
          value={{ OTP_DETAILS_KEY: 'otpDetails', onOtpValidated, mailPretext, mailSubject }}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </AuthContext.Provider>
      </div>
    </main>
  );
};
export default AuthLayout;
