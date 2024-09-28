import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

export const shipmentApi = createApi({
  reducerPath: 'shipment',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.shiptment,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' }
  }),
  endpoints: build => ({
    getAllSipments: build.query<any, any>({
      query: () => `/`,
    }),
    createShipment: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      }
    }),
    updateShipment: build.mutation<any, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'PUT',
          body
        };
      }
    }),
    deleteShipment: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      }
    })
  })
});

export const { useCreateShipmentMutation, useUpdateShipmentMutation, useGetAllSipmentsQuery } = shipmentApi;
