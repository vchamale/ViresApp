import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

export const originApi = createApi({
  reducerPath: 'origin',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.origin,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' }
  }),
  endpoints: build => ({
    getAllOrigins: build.query<any, any>({
      query: () => `/`,
      
    }),
    createOrigin: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      }
    }),
    updateOrigin: build.mutation<any, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'PUT',
          body
        };
      }
    }),
    deleteOrigin: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      }
    })
  })
});

export const { useCreateOriginMutation, useUpdateOriginMutation, useGetAllOriginsQuery } = originApi;
