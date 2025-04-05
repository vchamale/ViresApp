import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const makeApi = createApi({
  reducerPath: 'make',
  baseQuery: createBaseQuery(api.vires.make),
  tagTypes: ['Make'],
  endpoints: build => ({
    getAllMake: build.query<any, any>({
      query: ({ search }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['Make'],
    }),
    getMakeById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Make', id }],
    }),
    getAllModelsByMakeId: build.query<any, any>({
      query: ({ id }) => {
        return `/${id}/model`;
      },
      providesTags: ['Make'],
    }),
    createMake: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Make'],
    }),
    updateMake: build.mutation<any, Partial<any>>({
      query({ id, body }) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: ['Make'],
    }),
    deleteMake: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Make'],
    })
  })
});

export const { useCreateMakeMutation, useUpdateMakeMutation, useGetAllMakeQuery, useGetMakeByIdQuery, useLazyGetAllMakeQuery, useGetAllModelsByMakeIdQuery } = makeApi;
