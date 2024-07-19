import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';

const { LOGIN, REGISTER, FORGOT_PASSWORD, VERIFY_EMAIL, RESET_PASSWORD } = PATHS;

const Login = lazy(() => import('pages/auth/Login'));
const Register = lazy(() => import('pages/auth/Register'));
const VerifyEmail = lazy(() => import('pages/auth/VerifyEmail'));
const ResetPassword = lazy(() => import('pages/auth/ResetPassword'));
const ForgotPassword = lazy(() => import('pages/auth/ForgotPassword'));

const authRoutes: RouteObject[] = [
  { path: LOGIN, index: true, element: <Login /> },
  { path: REGISTER, element: <Register /> },
  { path: VERIFY_EMAIL, element: <VerifyEmail /> },
  { path: RESET_PASSWORD, element: <ResetPassword /> },
  { path: FORGOT_PASSWORD, element: <ForgotPassword /> }
];

export default authRoutes;
