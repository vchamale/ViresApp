import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

export const originApi = createApi({
  reducerPath: 'origin',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.origin,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' }
  }),
  tagTypes: ['Origin'],
  endpoints: build => ({
    getAllOrigins: build.query<any, any>({
      query: ({ search }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['Origin'],
    }),
    getOriginById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Origin', id }],
    }),
    createOrigin: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Origin'],
    }),
    updateOrigin: build.mutation<any, Partial<any>>({
      query({ id, body }) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: ['Origin'],
    }),
    deleteOrigin: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Origin'],
    })
  })
});

export const { useCreateOriginMutation, useUpdateOriginMutation, useGetAllOriginsQuery, useGetOriginByIdQuery, useLazyGetAllOriginsQuery } = originApi;
