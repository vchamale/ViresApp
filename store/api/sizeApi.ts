import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';
import { SizeT } from '@types/Size';

export const sizeApi = createApi({
  reducerPath: 'size',
  baseQuery: createBaseQuery(api.vires.size), // <- asegúrate de tener esta base URL en tu config
  tagTypes: ['Size'],
  endpoints: (build) => ({
    // GET /sizes?search=&limit=&offset=
    getAllSizes: build.query<SizeT[], { search?: string; limit?: number; offset?: number } | void>({
      query: (params) => ({
        url: '/',
        params,
      }),
      providesTags: (result) =>
        result
          ? [
              { type: 'Size', id: 'LIST' },
              ...result.map((s) => ({ type: 'Size' as const, id: s.sizeId })),
            ]
          : [{ type: 'Size', id: 'LIST' }],
    }),

    // GET /sizes/:id
    getSizeById: build.query<SizeT, number>({
      query: (id) => `/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Size', id }],
    }),

    // POST /sizes
    createSize: build.mutation<SizeT, Partial<Omit<SizeT, 'sizeId'>>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: [{ type: 'Size', id: 'LIST' }],
    }),

    // PUT /sizes/:id
    updateSize: build.mutation<
      SizeT,
      { id: number; data: Partial<Omit<SizeT, 'sizeId'>> }
    >({
      query({ id, data }) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body: data,
        };
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Size', id },
        { type: 'Size', id: 'LIST' },
      ],
    }),

    // DELETE /sizes/:id
    deleteSize: build.mutation<{ success: boolean }, { id: number }>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: (_res, _err, { id }) => [
        { type: 'Size', id },
        { type: 'Size', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllSizesQuery,
  useGetSizeByIdQuery,
  useCreateSizeMutation,
  useUpdateSizeMutation,
  useDeleteSizeMutation,
} = sizeApi;
