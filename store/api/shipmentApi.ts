import { createApi } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const shipmentApi = createApi({
  reducerPath: 'shipment',
  baseQuery: createBaseQuery(api.vires.shipment),
  tagTypes: ['Shipment'],
  endpoints: build => ({
    getAllShipments: build.query<any, any>({
      query: ({ search, startDate, endDate }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['Shipment'],
    }),
    getShipmentById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Shipment', id }],
    }),
    createShipment: build.mutation<{ data: any }, Partial<any>>({
      query(body) {
        return {
          url: '/',
          method: 'POST',
          body
        };
      },
      invalidatesTags: ['Shipment'],
    }),
    updateShipment: build.mutation<any, Partial<any>>({
      query({ id, body }) {
        return {
          url: `/${id}`,
          method: 'PUT',
          body
        };
      },
      invalidatesTags: ['Shipment'],
    }),
    deleteShipment: build.mutation<any, Partial<any>>({
      query({ id }) {
        return {
          url: `/${id}`,
          method: 'DELETE'
        };
      },
      invalidatesTags: ['Shipment'],
    })
  })
});

export const { useCreateShipmentMutation, useUpdateShipmentMutation, useGetAllShipmentsQuery, useLazyGetAllShipmentsQuery, useGetShipmentByIdQuery } = shipmentApi;
