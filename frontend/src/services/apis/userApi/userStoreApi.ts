import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';
import Constants from 'Constants';

const {
  USERS,
  LOGIN,
  BASE_URL,
  REGISTER,
  GET_USERS,
  RESERVE_SPACE,
  USER_CHECK_IN,
  USER_CHECK_OUT,
  DECLINE_RESERVATION,
  CONFIRM_RESERVATION,
  DELETE_PROFILE_IMAGE
} = Endpoints;

const { PROFILE_IMAGE_KEY, USER_PAYLOAD_KEY } = Constants;

// create the createApi
export const userStoreApi = createApi({
  reducerPath: 'userStoreApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    register: builder.mutation({
      query: (body: UserRegisterPayload) => {
        const bodyObject = { ...body };
        const { profileImage } = bodyObject;
        delete bodyObject.profileImage;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(PROFILE_IMAGE_KEY, profileImage as Blob);

        return { body: formData, url: REGISTER, method: 'POST' };
      }
    }),
    login: builder.mutation({
      query: (user: UserLoginPayload) => ({ url: LOGIN, method: 'POST', body: user })
    }),
    updateUser: builder.mutation({
      query: (body: UserUpdatePayload) => {
        const bodyObject = { ...body };
        const { profileImage } = bodyObject;
        delete bodyObject.profileImage;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(PROFILE_IMAGE_KEY, profileImage as Blob);

        return { body: formData, method: 'PATCH', url: `${USERS}/${body._id}` };
      }
    }),
    getUsers: builder.mutation({
      query: (body: GetUsersPayload) => ({
        method: 'GET',
        params: body.params,
        url: `${GET_USERS}/${body.userID}`
      })
    }),
    getUser: builder.mutation({
      query: (body: GetUserPayload) => ({
        method: 'GET',
        params: body.params,
        url: `${USERS}/${body._id}`
      })
    }),
    deleteUser: builder.mutation({
      query: (body: DeleteUserPayload) => ({
        body,
        method: 'DELETE',
        url: `${USERS}/${body._id}`
      })
    }),
    deleteProfileImage: builder.mutation({
      query: (body: DeleteProfileImagePayload) => ({
        body,
        method: 'PATCH',
        url: `${DELETE_PROFILE_IMAGE}/${body._id}`
      })
    }),
    reserveSpace: builder.mutation({
      query: (body: ReserveSpacePayload) => ({
        body,
        method: 'POST',
        url: `${RESERVE_SPACE}/${body.roomID}`
      })
    }),
    confirmReservation: builder.mutation({
      query: (body: ReservationPayload) => ({
        body,
        method: 'POST',
        url: `${CONFIRM_RESERVATION}/${body.reservationID}`
      })
    }),
    declineReservation: builder.mutation({
      query: (body: ReservationPayload) => ({
        body,
        method: 'POST',
        url: `${DECLINE_RESERVATION}/${body.reservationID}`
      })
    }),
    userCheckIn: builder.mutation({
      query: (body: EntryPayload) => ({
        body,
        method: 'POST',
        url: `${USER_CHECK_IN}/${body._id}`
      })
    }),
    userCheckOut: builder.mutation({
      query: (body: EntryPayload) => ({
        body,
        method: 'POST',
        url: `${USER_CHECK_OUT}/${body._id}`
      })
    })
  })
});

export const {
  useLoginMutation,
  useGetUserMutation,
  useGetUsersMutation,
  useRegisterMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUserCheckInMutation,
  useReserveSpaceMutation,
  useUserCheckOutMutation,
  useDeleteProfileImageMutation,
  useConfirmReservationMutation,
  useDeclineReservationMutation
} = userStoreApi;

export default userStoreApi;
