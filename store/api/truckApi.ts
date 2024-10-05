import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

export const truckApi = createApi({
  reducerPath: 'truck',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.truck,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' }
  }),
  endpoints: build => ({
    getAllTrucks: build.query<any, any>({
      query: () => `/`,
      
    }),
    createTruck: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      }
    }),
    updateTruck: build.mutation<any, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'PUT',
          body
        };
      }
    }),
    deleteTruck: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      }
    })
  })
});

export const { useCreateTruckMutation, useUpdateTruckMutation, useGetAllTrucksQuery } = truckApi;
