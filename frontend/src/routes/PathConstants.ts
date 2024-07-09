export const PATHS = {
  HOME: '/',
  LOGIN: '/auth',
  HOSTELS: '/hostels',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  REGISTER: '/auth/register',
  ADD_HOSTEL: '/hostels/add',
  RESERVATIONS: '/reservations',
  VERIFY_OTP: '/auth/verify-otp',
  RESET_PASSWORD: '/auth/reset-password',
  HOSTEL_ROOMS: '/hostels/:hostelID/rooms',
  ROOM: '/hostels/:hostelID/rooms/:roomID',
  FORGOT_PASSWORD: '/auth/forgot-password',
  ADD_HOSTEL_ROOM: '/hostels/:hostelID/rooms/add',
  EDIT_HOSTEL_ROOM: '/hostels/:hostelID/rooms/:roomID/edit'
} as const;
