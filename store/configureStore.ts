import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import rootReducers from "./reducers";
import { shipmentApi } from "@api/shipmentApi";
import { destinationApi } from "@api/destinationApi";
import { originApi } from "@api/originApi";
import { truckApi } from "@api/truckApi";
import { clientApi } from "@api/clientApi";
import { currencyApi } from "@api/currencyApi";
import { driverApi } from "@api/driverApi";
import { containerApi } from "@api/containerApi";

const store = configureStore({
  reducer: rootReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
      .concat(authApi.middleware)
      .concat(shipmentApi.middleware)
      .concat(destinationApi.middleware)
      .concat(originApi.middleware)
      .concat(clientApi.middleware)
      .concat(truckApi.middleware)
      .concat(currencyApi.middleware)
      .concat(driverApi.middleware)
      .concat(containerApi.middleware),
  preloadedState: {},
  devTools: !Object.is(process.env.NODE_ENV, 'production')
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
