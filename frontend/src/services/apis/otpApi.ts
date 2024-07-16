import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, OTP_SEND, OTP_VERIFY } = Endpoints;

// create the createApi
export const otpApi = createApi({
  reducerPath: 'otpApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    sendOtp: builder.mutation({
      query: (body: SendOtpPayload) => ({ url: OTP_SEND, method: 'POST', body })
    }),
    verifyOtp: builder.mutation({
      query: (body: VerifyOtpPayload) => ({ url: OTP_VERIFY, method: 'POST', body })
    })
  })
});

export const { useSendOtpMutation, useVerifyOtpMutation } = otpApi;

export default otpApi;
