import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Endpoints from 'services/Endpoints';
import Constants from 'Constants';

const { BASE_URL, HOSTELS } = Endpoints;

const { USER_PAYLOAD_KEY, HOSTEL_IMAGE_KEY } = Constants;

// create the createApi
export const hostelStoreApi = createApi({
  reducerPath: 'hostelStoreApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: builder => ({
    createHostel: builder.mutation({
      query: (body: CreateHostelPayload) => {
        const bodyObject = { ...body };
        const { hostelImage } = bodyObject;
        delete bodyObject.hostelImage;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(HOSTEL_IMAGE_KEY, hostelImage as Blob);

        return { body: formData, url: HOSTELS, method: 'POST' };
      }
    }),
    updateHostel: builder.mutation({
      query: (body: UpdateHostelPayload) => {
        const bodyObject = { ...body };
        const { hostelImage } = bodyObject;
        delete bodyObject.hostelImage;

        const stringifiedObject = JSON.stringify(bodyObject);
        const documentBlob = new Blob([stringifiedObject], { type: 'application/json' });

        const formData = new FormData();
        formData.append(USER_PAYLOAD_KEY, documentBlob);
        formData.append(HOSTEL_IMAGE_KEY, hostelImage as Blob);

        return { body: formData, method: 'PATCH', url: `${HOSTELS}/${body._id}` };
      }
    }),
    getHostels: builder.mutation({
      query: (body: GetHostelsPayload) => ({ method: 'GET', params: body.params, url: HOSTELS })
    }),
    getHostel: builder.mutation({
      query: (body: GetHostelPayload) => ({ method: 'GET', url: `${HOSTELS}/${body._id}` })
    }),
    deleteHostel: builder.mutation({
      query: (body: DeleteHostelPayload) => ({
        body,
        method: 'DELETE',
        url: `${HOSTELS}/${body._id}`
      })
    })
  })
});

export const {
  useGetHostelMutation,
  useGetHostelsMutation,
  useCreateHostelMutation,
  useDeleteHostelMutation,
  useUpdateHostelMutation
} = hostelStoreApi;

export default hostelStoreApi;
