import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "@api/authApi";
import counterSlice from "@slice/counterSlice";

const rootReducers = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [counterSlice.name]: counterSlice.reducer,
});

export default rootReducers;
