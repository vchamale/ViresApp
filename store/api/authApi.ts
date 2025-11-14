import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

type LoginT = {
  email: string;
  password: string;
};

type SignUpT = {
  email: string;
  gender: string;
  idcountry: number;
  idprofile: number;
  lastName: string;
  logincount: number;
  name: string;
  password: string;
  phone: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.auth,
    credentials: 'include',
    timeout: 3000,
    headers: { 'Content-type': 'application/json' },
  }),
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, Partial<LoginT>>({
      query(body) {
        return {
          url: '/login',
          method: 'POST',
          body,
        };
      },
    }),
    signUp: build.mutation<SignUpT, Partial<SignUpT>>({
      query(body) {
        return {
          url: '/register',
          method: 'POST',
          body,
        };
      },
    }),
    refreshToken: build.query<{ accessToken: string }, { accessToken: string }>({
      query: () => ({
        url: '/refresh-token',
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useSignUpMutation, useLazyRefreshTokenQuery } = authApi;
