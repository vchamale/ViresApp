import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const roleApi = createApi({
  reducerPath: 'role',
  baseQuery: createBaseQuery(api.vires.role),
  tagTypes: ['Role'],
  endpoints: (build) => ({
    getAllRoles: build.query<any, any>({
      query: () => `/`,
      providesTags: ['Role'],
    }),
    getRoleById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
  }),
});

export const { useGetAllRolesQuery, useLazyGetAllRolesQuery, useGetRoleByIdQuery } = roleApi;
