import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@api/authApi";
import counterSlice from "@slice/counterSlice";
import { shipmentApi } from "@api/shipmentApi";

const rootReducers = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [shipmentApi.reducerPath]: shipmentApi.reducer,
  [counterSlice.name]: counterSlice.reducer,
});

export default rootReducers;
