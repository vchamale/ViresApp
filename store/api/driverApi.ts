import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const driverApi = createApi({
  reducerPath: 'driver',
  baseQuery: createBaseQuery(api.vires.driver),
  tagTypes: ['Drivers'],
  endpoints: build => ({
    getAllDrivers: build.query<any, any>({
      query: ({ search }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['Drivers'],
    }),
    getDriverById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Drivers', id }],
    }),
    createDriver: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Drivers'],
    }),
    updateDriver: build.mutation<any, Partial<any>>({
      query({ id, body }) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: ['Drivers'],
    }),
    deleteDriver: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Drivers'],
    })
  })
});

export const { useCreateDriverMutation, useUpdateDriverMutation, useGetAllDriversQuery, useLazyGetAllDriversQuery, useGetDriverByIdQuery } = driverApi;
