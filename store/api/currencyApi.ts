import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

export const currencyApi = createApi({
  reducerPath: 'currency',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.currency,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' }
  }),
  endpoints: build => ({
    getAllCurrencys: build.query<any, any>({
      query: () => `/`,
      
    }),
    createCurrency: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      }
    }),
    updateCurrency: build.mutation<any, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'PUT',
          body
        };
      }
    }),
    deleteCurrency: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      }
    })
  })
});

export const { useCreateCurrencyMutation, useUpdateCurrencyMutation, useGetAllCurrencysQuery } = currencyApi;
