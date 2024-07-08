import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, RATINGS } = Endpoints;

// create the createApi
export const ratingApi = createApi({
  reducerPath: 'ratingApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    updateRating: builder.mutation({
      query: (body: RatingUpdatePayload) => ({ body, url: RATINGS, method: 'POST' })
    })
  })
});

export const { useUpdateRatingMutation } = ratingApi;

export default ratingApi;
