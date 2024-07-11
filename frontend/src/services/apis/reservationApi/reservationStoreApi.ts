import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';

const { BASE_URL, RESERVATIONS, RESERVATIONS_LENGTH } = Endpoints;

// create the createApi
export const reservationStoreApi = createApi({
  reducerPath: 'reservationStoreApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    getReservations: builder.mutation({
      query: (body: GetReservationsPayload) => ({
        method: 'GET',
        url: RESERVATIONS,
        params: body.params
      })
    }),
    getReservationsLength: builder.mutation({
      query: (body: GetReservationsLengthPayload) => ({
        method: 'GET',
        params: body.params,
        url: RESERVATIONS_LENGTH
      })
    })
  })
});

export const { useGetReservationsMutation, useGetReservationsLengthMutation } = reservationStoreApi;

export default reservationStoreApi;
