import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/authApi";
import rootReducers from "./reducers";
import { shipmentApi } from "@api/shipmentApi";

const store = configureStore({
  reducer: rootReducers,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
      .concat(authApi.middleware)
      .concat(shipmentApi.middleware),
  preloadedState: {},
  devTools: !Object.is(process.env.NODE_ENV, 'production')
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
