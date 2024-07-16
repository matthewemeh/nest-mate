import { Outlet, useNavigate } from 'react-router-dom';
import { createContext, Suspense, useCallback, useEffect, useMemo } from 'react';

import Loading from 'components/Loading';
import { PATHS } from 'routes/PathConstants';
import { updateUserData } from 'services/userData/userDataSlice';
import { updateUser } from 'services/apis/userApi/userStoreSlice';
import { useAppDispatch, useAppSelector } from 'hooks/useRootStorage';

export const AuthContext = createContext<Partial<AuthContext>>({});

const AuthLayout = () => {
  const { HOME, LOGIN, RESET_PASSWORD } = PATHS;

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector(state => state.userData);
  const { _id, token } = useAppSelector(state => state.userStore.currentUser);

  useEffect(() => {
    if (!token) navigate(LOGIN);
  }, [token]);

  const mailSubject = useMemo(() => {
    if (_id) {
      return 'Email Verification for Nest Mate';
    } else {
      return 'Password Reset Request for Nest Mate';
    }
  }, [_id]);

  const onOtpValidated = useCallback(
    _id
      ? () => {
          // for validating email
          dispatch(updateUser({ emailValidated: true }));
          setTimeout(() => {
            isAuthenticated ? navigate(HOME) : navigate(LOGIN);
          }, 2000);
        }
      : () => {
          // for resetting password
          dispatch(updateUserData({ isOtpVerified: true }));
          setTimeout(() => {
            navigate(RESET_PASSWORD);
            window.location.reload();
          }, 2000);
        },
    [isAuthenticated, _id]
  );

  return (
    <main className='h-screen grid grid-cols-2'>
      <div></div>
      <div className='bg-swan-white text-lightning-yellow-900'>
        <AuthContext.Provider value={{ onOtpValidated, mailSubject }}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </AuthContext.Provider>
      </div>
    </main>
  );
};
export default AuthLayout;
