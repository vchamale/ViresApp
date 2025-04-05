import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const currencyApi = createApi({
  reducerPath: 'currency',
  baseQuery: createBaseQuery(api.vires.currency),
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
