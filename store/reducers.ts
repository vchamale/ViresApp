import { combineReducers, createAction } from '@reduxjs/toolkit';
import { authApi } from '@api/authApi';
import counterSlice from '@slice/counterSlice';
import { shipmentApi } from '@api/shipmentApi';
import { destinationApi } from '@api/destinationApi';
import { originApi } from '@api/originApi';
import { truckApi } from '@api/truckApi';
import shipmentSlice from '@slice/shipmentSlice';
import { clientApi } from '@api/clientApi';
import { currencyApi } from '@api/currencyApi';
import { driverApi } from '@api/driverApi';
import { containerApi } from '@api/containerApi';
import { documentApi } from '@api/documentApi';
import { makeApi } from '@api/makeApi';
import { shipmentStatusApi } from '@api/shipmentStatusApi';
import { roleApi } from '@api/roleApi';
import userSlice from '@slice/userSlice';
import pageControlSlice from '@slice/pageControlSlice';
import { sizeApi } from '@api/sizeApi';

// Acción para reiniciar el estado global
export const resetStore = createAction('RESET_STORE');

// ** Estado inicial de cada slice**
const initialState = {
  [counterSlice.name]: counterSlice.getInitialState(),
  [pageControlSlice.name]: pageControlSlice.getInitialState(),
  [shipmentSlice.name]: shipmentSlice.getInitialState(),
  [userSlice.name]: userSlice.getInitialState(),
};

const appReducers = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [sizeApi.reducerPath]: sizeApi.reducer,
  [roleApi.reducerPath]: roleApi.reducer,
  [shipmentApi.reducerPath]: shipmentApi.reducer,
  [shipmentStatusApi.reducerPath]: shipmentStatusApi.reducer,
  [documentApi.reducerPath]: documentApi.reducer,
  [destinationApi.reducerPath]: destinationApi.reducer,
  [originApi.reducerPath]: originApi.reducer,
  [truckApi.reducerPath]: truckApi.reducer,
  [makeApi.reducerPath]: makeApi.reducer,
  [clientApi.reducerPath]: clientApi.reducer,
  [driverApi.reducerPath]: driverApi.reducer,
  [containerApi.reducerPath]: containerApi.reducer,
  [currencyApi.reducerPath]: currencyApi.reducer,
  [counterSlice.name]: counterSlice.reducer,
  [pageControlSlice.name]: pageControlSlice.reducer,
  [shipmentSlice.name]: shipmentSlice.reducer,
  [userSlice.name]: userSlice.reducer,
});

const rootReducers = (state: any, action: any) => {
  if (action.type === resetStore.type) {
    state = {
      ...initialState, // Reinicia a los valores iniciales
    };
  }
  return appReducers(state, action);
};

export default rootReducers;
