import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';
import { authApi } from './api/authApi';
import rootReducers from './reducers';
import { shipmentApi } from '@api/shipmentApi';
import { destinationApi } from '@api/destinationApi';
import { originApi } from '@api/originApi';
import { truckApi } from '@api/truckApi';
import { clientApi } from '@api/clientApi';
import { currencyApi } from '@api/currencyApi';
import { driverApi } from '@api/driverApi';
import { containerApi } from '@api/containerApi';
import { documentApi } from '@api/documentApi';
import { makeApi } from '@api/makeApi';
import { shipmentStatusApi } from '@api/shipmentStatusApi';
import { roleApi } from '@api/roleApi';
import { sizeApi } from '@api/sizeApi';

// 🔹 Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // Guardará el estado en AsyncStorage
  whitelist: ['auth'], // Opcional: define qué slices de estado quieres persistir
};

// Reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(sizeApi.middleware)
      .concat(roleApi.middleware)
      .concat(shipmentApi.middleware)
      .concat(shipmentStatusApi.middleware)
      .concat(documentApi.middleware)
      .concat(destinationApi.middleware)
      .concat(originApi.middleware)
      .concat(truckApi.middleware)
      .concat(makeApi.middleware)
      .concat(clientApi.middleware)
      .concat(driverApi.middleware)
      .concat(containerApi.middleware)
      .concat(currencyApi.middleware),
  preloadedState: {},
  devTools: !Object.is(process.env.NODE_ENV, 'production'),
});

// 🔹 Persistor para manejar la persistencia
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
