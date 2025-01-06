import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@api/authApi";
import counterSlice from "@slice/counterSlice";
import { shipmentApi } from "@api/shipmentApi";
import { destinationApi } from "@api/destinationApi";
import { originApi } from "@api/originApi";
import { truckApi } from "@api/truckApi";
import shipmentSlice from "@slice/shipmentSlice";
import { clientApi } from "@api/clientApi";
import { currencyApi } from "@api/currencyApi";
import { driverApi } from "@api/driverApi";
import { containerApi } from "@api/containerApi";
import { documentApi } from "@api/documentApi";
import { makeApi } from "@api/makeApi";
import { shipmentStatusApi } from "@api/shipmentStatusApi";

const rootReducers = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [shipmentApi.reducerPath]: shipmentApi.reducer,
  [shipmentStatusApi.reducerPath]: shipmentStatusApi.reducer,
  [documentApi.reducerPath]: documentApi.reducer,
  [destinationApi.reducerPath]: destinationApi.reducer,
  [originApi.reducerPath]: originApi.reducer,
  [truckApi.reducerPath]: truckApi.reducer,
  [makeApi.reducerPath]: makeApi.reducer,
  [clientApi.reducerPath]: clientApi.reducer,
  [currencyApi.reducerPath]: currencyApi.reducer,
  [driverApi.reducerPath]: driverApi.reducer,
  [containerApi.reducerPath]: containerApi.reducer,
  [counterSlice.name]: counterSlice.reducer,
  [shipmentSlice.name]: shipmentSlice.reducer,
});

export default rootReducers;
