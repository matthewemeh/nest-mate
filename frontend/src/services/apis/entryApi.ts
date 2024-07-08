import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, ENTRIES } = Endpoints;

// create the createApi
export const entryApi = createApi({
  reducerPath: 'entryApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    getEntries: builder.mutation({
      query: (body: GetEntriesPayload) => ({ method: 'GET', url: ENTRIES, params: body.params })
    })
  })
});

export const { useGetEntriesMutation } = entryApi;

export default entryApi;
