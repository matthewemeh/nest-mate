import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';
import Constants from 'Constants';

const { BASE_URL, ROOMS } = Endpoints;

const { USER_PAYLOAD_KEY, ROOM_IMAGE_KEY } = Constants;

// create the createApi
export const roomStoreApi = createApi({
  reducerPath: 'roomStoreApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    createRoom: builder.mutation({
      query: (body: CreateRoomPayload) => {
        const bodyObject = { ...body };
        const { roomImage } = bodyObject;
        delete bodyObject.roomImage;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(ROOM_IMAGE_KEY, roomImage as Blob);

        return { body: formData, url: ROOMS, method: 'POST' };
      }
    }),
    updateRoom: builder.mutation({
      query: (body: UpdateRoomPayload) => {
        const bodyObject = { ...body };
        const { roomImage } = bodyObject;
        delete bodyObject.roomImage;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(ROOM_IMAGE_KEY, roomImage as Blob);

        return { body: formData, method: 'PATCH', url: `${ROOMS}/${body._id}` };
      }
    }),
    getRooms: builder.mutation({
      query: (body: GetRoomsPayload) => ({ method: 'GET', params: body.params, url: ROOMS })
    }),
    getRoom: builder.mutation({
      query: (body: GetRoomPayload) => ({ method: 'GET', url: `${ROOMS}/${body._id}` })
    }),
    deleteRoom: builder.mutation({
      query: (body: DeleteRoomPayload) => ({ body, method: 'DELETE', url: `${ROOMS}/${body._id}` })
    })
  })
});

export const {
  useGetRoomMutation,
  useGetRoomsMutation,
  useUpdateRoomMutation,
  useCreateRoomMutation,
  useDeleteRoomMutation
} = roomStoreApi;

export default roomStoreApi;
