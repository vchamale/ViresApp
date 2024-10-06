import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { ShipmentT } from '../../types/Shipment';

const initialState: ShipmentT = {
  client: null,
  origin: null,
  destination: null,
  container: null,
  // policy: '',
  weight: 0.00,
  price: {
    currency: null,
    amount: 0.00
  },
  driver: null,
  truck: null,
  notes: ''
};


const shipmentSlice = createSlice({
  name: 'shipmentSlice',
  initialState,
  reducers: {
    addClient(state, action: PayloadAction<any>) {
      state.client = action.payload;
    },
    addShipmentRoute(state, action: PayloadAction<any>) {
      state.origin = action.payload.origin;
      state.destination = action.payload.destination;
    },
    addContainerDetails(state, action: PayloadAction<any>) {
      state.container = action.payload.container;
      // state.policy = action.payload.policy;
      state.weight = action.payload.weight;
      state.price = action.payload.price;
    },
    addTransportDetails(state, action: PayloadAction<any>) {
      state.driver = action.payload.driver;
      state.truck = action.payload.truck;
      state.notes = action.payload.notes;
    }
  }
});

export const { addClient, addShipmentRoute, addContainerDetails, addTransportDetails } = shipmentSlice.actions;

export const shipmentSelector = (state: RootState) => state.shipmentSlice;

export default shipmentSlice;
