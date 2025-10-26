import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const documentApi = createApi({
  reducerPath: 'document',
  baseQuery: createBaseQuery(api.vires.document),
  tagTypes: ['Document'],
  endpoints: (build) => ({
    getAllDocuments: build.query<any, any>({
      query: ({ documentNumber, startDate, endDate }) => {
        const params: Record<string, string> = {};

        if (documentNumber) params.documentNumber = documentNumber;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['Document'],
    }),
    getDocumentById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Document', id }],
    }),
    createDocument: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body,
        };
      },
      invalidatesTags: ['Document'],
    }),
    updateDocument: build.mutation<any, { id: string | number; body: Partial<any> }>({
      query({ id, body }) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['Document'],
    }),
    deleteDocument: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['Document'],
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useGetAllDocumentsQuery,
  useGetDocumentByIdQuery,
  useLazyGetAllDocumentsQuery,
} = documentApi;
