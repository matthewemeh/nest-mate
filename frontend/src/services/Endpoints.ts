import { isDevMode } from 'helpers/devDetect';

export default {
  EMAIL: '/email',
  USERS: '/users',
  ROOMS: '/rooms',
  ENTRIES: '/entries',
  RATINGS: '/ratings',
  HOSTELS: '/hostels',
  OTP_SEND: '/otp/send',
  LOGIN: '/users/login',
  OTP_VERIFY: '/otp/verify',
  GET_USERS: '/users/fetch',
  EMAIL_SEND: '/email/send',
  REGISTER: '/users/register',
  RESERVATIONS: '/reservations',
  USER_CHECK_IN: '/users/check-in',
  USER_CHECK_OUT: '/users/check-out',
  RESERVE_SPACE: '/users/reserve-space',
  RESERVATIONS_LENGTH: '/reservations/length',
  CONFIRM_RESERVATION: '/users/confirm-reservation',
  DECLINE_RESERVATION: '/users/decline-reservation',
  DELETE_PROFILE_IMAGE: '/users/delete-profile-image',
  BASE_URL: isDevMode() ? 'http://localhost:8080' : process.env.REACT_APP_BACKEND_URL
};
