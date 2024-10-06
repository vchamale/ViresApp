import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

export const driverApi = createApi({
  reducerPath: 'driver',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.driver,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' }
  }),
  endpoints: build => ({
    getAllDrivers: build.query<any, any>({
      query: () => `/`,
      
    }),
    createDriver: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      }
    }),
    updateDriver: build.mutation<any, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'PUT',
          body
        };
      }
    }),
    deleteDriver: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      }
    })
  })
});

export const { useCreateDriverMutation, useUpdateDriverMutation, useGetAllDriversQuery } = driverApi;
