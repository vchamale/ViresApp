import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';

export const shipmentStatusApi = createApi({
  reducerPath: 'shipmentStatus',
  baseQuery: fetchBaseQuery({
    baseUrl: api.vires.shiptmentStatus,
    timeout: 3000,
    headers: { 'Content-type': 'application/json' }
  }),
  tagTypes: ['ShipmentStatus'],
  endpoints: build => ({
    getAllShipmentsStatus: build.query<any, any>({
      query: ({ search, startDate, endDate }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['ShipmentStatus'],
    }),
    getShipmentStatusById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'ShipmentStatus', id }],
    })
  })
});

export const { useGetAllShipmentsStatusQuery } = shipmentStatusApi;
