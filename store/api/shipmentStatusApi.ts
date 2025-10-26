import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { api } from '../../config/config';
import createBaseQuery from 'store/util/baseQuery';

export const shipmentStatusApi = createApi({
  reducerPath: 'shipmentStatus',
  baseQuery: createBaseQuery(api.vires.shiptmentStatus),
  tagTypes: ['ShipmentStatus'],
  endpoints: (build) => ({
    getAllShipmentsStatus: build.query<any, any>({
      query: ({ search }) => {
        const params: Record<string, string> = {};

        if (search) params.search = search;

        const queryString = new URLSearchParams(params).toString();
        return `/?${queryString}`;
      },
      providesTags: ['ShipmentStatus'],
    }),
    getShipmentStatusById: build.query<any, string | number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'ShipmentStatus', id }],
    }),
  }),
});

export const { useGetAllShipmentsStatusQuery, useLazyGetAllShipmentsStatusQuery } =
  shipmentStatusApi;
