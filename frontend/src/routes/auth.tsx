import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';

const { LOGIN, REGISTER, FORGOT_PASSWORD, VERIFY_OTP, RESET_PASSWORD } = PATHS;

const Login = lazy(() => import('pages/auth/Login'));
const Register = lazy(() => import('pages/auth/Register'));
const VerifyOTP = lazy(() => import('pages/auth/VerifyOTP'));
const ResetPassword = lazy(() => import('pages/auth/ResetPassword'));
const ForgotPassword = lazy(() => import('pages/auth/ForgotPassword'));

const authRoutes: RouteObject[] = [
  { path: LOGIN, index: true, element: <Login /> },
  { path: REGISTER, element: <Register /> },
  { path: VERIFY_OTP, element: <VerifyOTP /> },
  { path: RESET_PASSWORD, element: <ResetPassword /> },
  { path: FORGOT_PASSWORD, element: <ForgotPassword /> }
];

export default authRoutes;
