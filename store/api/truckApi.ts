import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const truckApi = createApi({
  reducerPath: 'truck',
  baseQuery: createBaseQuery(api.vires.truck),
  tagTypes: ['Vehicle'],
  endpoints: (build) => ({
    getAllTrucks: build.query<any, any>({
      query: ({ search }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['Vehicle'],
    }),
    getTruckById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Vehicle', id }],
    }),
    createTruck: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Vehicle'],
    }),
    updateTruck: build.mutation<any, Partial<any>>({
      query({ id, body }) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['Vehicle'],
    }),
    deleteTruck: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const {
  useCreateTruckMutation,
  useUpdateTruckMutation,
  useGetAllTrucksQuery,
  useGetTruckByIdQuery,
  useLazyGetAllTrucksQuery,
} = truckApi;
