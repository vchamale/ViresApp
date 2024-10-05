import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

export const destinationApi = createApi({
  reducerPath: 'destination',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.destination,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' }
  }),
  endpoints: build => ({
    getAllDestinations: build.query<any, any>({
      query: () => `/`,
      
    }),
    createDestination: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      }
    }),
    updateDestination: build.mutation<any, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'PUT',
          body
        };
      }
    }),
    deleteDestination: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      }
    })
  })
});

export const { useCreateDestinationMutation, useUpdateDestinationMutation, useGetAllDestinationsQuery } = destinationApi;
