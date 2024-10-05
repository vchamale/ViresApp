import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

const shipmentSlice = createSlice({
  name: 'shipmentSlice',
  initialState: {
    customer: null,
    origin: null,
    destination: null,
    container: '',
    policy: '',
    weight: 0.00,
    price: 0.00,
    driver: null,
    truck: null
  },
  reducers: {
    addCustomer(state, action: PayloadAction<any>) {
      state.customer = action.payload;
    },
    addShipmentRoute(state, action: PayloadAction<any>) {
      state.origin = action.payload.origin;
      state.destination = action.payload.destination;
    },
    addContainerDetails(state, action: PayloadAction<any>) {
      state.container = action.payload.container;
      state.policy = action.payload.policy;
      state.weight = action.payload.weight;
      state.price = action.payload.price;
    },
    addTransportDetails(state, action: PayloadAction<any>) {
      state.driver = action.payload.driver;
      state.truck = action.payload.truck;
    }
  }
});

export const { addCustomer, addShipmentRoute, addContainerDetails, addTransportDetails } = shipmentSlice.actions;

export const shipmentSelector = (state: RootState) => state.shipmentSlice;

export default shipmentSlice;
