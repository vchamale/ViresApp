import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

type LoginT = {
  email: string;
  clave: string;
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

export const authApi = createApi({
  reducerPath: 'auth',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.auth,
    timeout: 100000,
    headers: { 'Content-type': 'application/json' }
  }),
  endpoints: build => ({
    login: build.mutation<{ data: any }, Partial<LoginT>>({
      query(body) {
        return {
          url: '/token',
          method: 'POST',
          body
        };
      }
    }),
    signUp: build.mutation<SignUpT, Partial<SignUpT>>({
      query(body) {
        return {
          url: 'signUp',
          method: 'POST',
          body
        };
      }
    })
  })
});

export const { useLoginMutation, useSignUpMutation } = authApi;
