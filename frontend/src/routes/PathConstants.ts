export const PATHS = {
  HOME: '/',
  LOGIN: '/auth',
  HOSTELS: '/hostels',
  PROFILE: '/profile',
  DASHBOARD: '/dashboard',
  REGISTER: '/auth/register',
  RESERVATIONS: '/reservations',
  ROOM: '/hostels/:id/rooms/:id',
  VERIFY_OTP: '/auth/verify-otp',
  HOSTEL_ROOMS: '/hostels/:id/rooms',
  RESET_PASSWORD: '/auth/reset-password',
  FORGOT_PASSWORD: '/auth/forgot-password'
} as const;
