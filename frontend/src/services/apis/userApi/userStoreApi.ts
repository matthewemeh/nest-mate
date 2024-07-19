import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';
import Constants from 'Constants';

const {
  USERS,
  LOGIN,
  BASE_URL,
  REGISTER,
  GET_USERS,
  VERIFY_EMAIL,
  RESERVE_SPACE,
  USER_CHECK_IN,
  RESET_PASSWORD,
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

        return {
          body: formData,
          method: 'PATCH',
          url: `${USERS}/${body._id}`,
          headers: { 'x-access-token': body.token }
        };
      }
    }),
    getUsers: builder.mutation({
      query: (body: GetUsersPayload) => ({
        method: 'GET',
        url: GET_USERS,
        params: body.params,
        headers: { 'x-access-token': body.token }
      })
    }),
    getUser: builder.mutation({
      query: (body: GetUserPayload) => ({
        method: 'GET',
        url: `${USERS}/${body._id}`,
        headers: { 'x-access-token': body.token }
      })
    }),
    deleteUser: builder.mutation({
      query: (body: DeleteUserPayload) => ({
        body,
        method: 'DELETE',
        url: `${USERS}/${body._id}`,
        headers: { 'x-access-token': body.token }
      })
    }),
    deleteProfileImage: builder.mutation({
      query: (body: DeleteProfileImagePayload) => ({
        body,
        method: 'PATCH',
        headers: { 'x-access-token': body.token },
        url: `${DELETE_PROFILE_IMAGE}/${body._id}`
      })
    }),
    reserveSpace: builder.mutation({
      query: (body: ReserveSpacePayload) => ({
        body,
        method: 'POST',
        url: `${RESERVE_SPACE}/${body.roomID}`,
        headers: { 'x-access-token': body.token }
      })
    }),
    confirmReservation: builder.mutation({
      query: (body: ReservationPayload) => ({
        body,
        method: 'POST',
        headers: { 'x-access-token': body.token },
        url: `${CONFIRM_RESERVATION}/${body.reservationID}`
      })
    }),
    declineReservation: builder.mutation({
      query: (body: ReservationPayload) => ({
        body,
        method: 'POST',
        headers: { 'x-access-token': body.token },
        url: `${DECLINE_RESERVATION}/${body.reservationID}`
      })
    }),
    userCheckIn: builder.mutation({
      query: (body: EntryPayload) => ({
        body,
        method: 'POST',
        url: `${USER_CHECK_IN}/${body._id}`,
        headers: { 'x-access-token': body.token }
      })
    }),
    userCheckOut: builder.mutation({
      query: (body: EntryPayload) => ({
        body,
        method: 'POST',
        url: `${USER_CHECK_OUT}/${body._id}`,
        headers: { 'x-access-token': body.token }
      })
    }),
    resetPassword: builder.mutation({
      query: (body: ResetPasswordPayload) => ({ body, method: 'PATCH', url: RESET_PASSWORD })
    }),
    verifyEmail: builder.mutation({
      query: (body: VerifyEmailPayload) => ({ body, method: 'PATCH', url: VERIFY_EMAIL })
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
  useVerifyEmailMutation,
  useUserCheckInMutation,
  useReserveSpaceMutation,
  useUserCheckOutMutation,
  useResetPasswordMutation,
  useDeleteProfileImageMutation,
  useConfirmReservationMutation,
  useDeclineReservationMutation
} = userStoreApi;

export default userStoreApi;
