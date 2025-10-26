import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const containerApi = createApi({
  reducerPath: 'container',
  baseQuery: createBaseQuery(api.vires.container),
  endpoints: (build) => ({
    getAllContainers: build.query<any, any>({
      query: () => `/`,
    }),
    createContainer: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body,
        };
      },
    }),
    updateContainer: build.mutation<any, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'PUT',
          body,
        };
      },
    }),
    deleteContainer: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const { useCreateContainerMutation, useUpdateContainerMutation, useGetAllContainersQuery } =
  containerApi;
