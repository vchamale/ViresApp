import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const destinationApi = createApi({
  reducerPath: 'destination',
  baseQuery: createBaseQuery(api.vires.destination),
  tagTypes: ['Destination'],
  endpoints: build => ({
    getAllDestinations: build.query<any, any>({
      query: ({ search }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['Destination'],
    }),
    getDestinationsById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Destination', id }],
    }),
    createDestination: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Destination'],
    }),
    updateDestination: build.mutation<any, Partial<any>>({
      query({ id, body }) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: ['Destination'],
    }),
    deleteDestination: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Destination'],
    })
  })
});

export const { useCreateDestinationMutation, useUpdateDestinationMutation, useGetAllDestinationsQuery, useGetDestinationsByIdQuery, useLazyGetAllDestinationsQuery } = destinationApi;
