import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const clientApi = createApi({
  reducerPath: 'client',
  baseQuery: createBaseQuery(api.vires.client),
  tagTypes: ['Client'],
  endpoints: build => ({
    getAllClients: build.query<any, any>({
      query: ({ search }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['Client'],
    }),
    getClientById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
    createClient: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Client'],
    }),
    updateClient: build.mutation<any, Partial<any>>({
      query({ id, body}) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: ['Client'],
    }),
    deleteClient: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Client'],
    })
  })
});

export const { useCreateClientMutation, useUpdateClientMutation, useGetAllClientsQuery, useLazyGetAllClientsQuery, useGetClientByIdQuery } = clientApi;
