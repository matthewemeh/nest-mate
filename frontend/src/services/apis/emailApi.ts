import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, EMAIL_SEND } = Endpoints;

// create the createApi
export const emailApi = createApi({
  reducerPath: 'emailApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    sendEmail: builder.mutation({
      query: (body: EmailSendPayload) => ({ url: EMAIL_SEND, method: 'POST', body })
    })
  })
});

export const { useSendEmailMutation } = emailApi;

export default emailApi;
