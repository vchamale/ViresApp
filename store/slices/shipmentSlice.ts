import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';
import { ShipmentT } from '../../types/Shipment';

const initialState: ShipmentT = {
  client: null,
  origin: null,
  destination: null,
  container: null,
  policy: null,
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
    addOrigin(state, action: PayloadAction<any>) {
      state.origin = action.payload;
    },
    addDestination(state, action: PayloadAction<any>) {
      state.destination = action.payload;
    },
    addContainer(state, action: PayloadAction<any>) {
      state.container = action.payload;
    },
    addCurrency(state, action: PayloadAction<any>) {
      state.price.currency = action.payload;
    },
    addPolicy(state, action: PayloadAction<any>) {
      state.policy = action.payload;
    },
    addWeight(state, action: PayloadAction<any>) {
      state.weight = action.payload;
    },
    addPrice(state, action: PayloadAction<any>) {
      state.price.amount = action.payload;
    },
    addDriver(state, action: PayloadAction<any>) {
      state.driver = action.payload;
    },
    addTruck(state, action: PayloadAction<any>) {
      state.truck = action.payload;
    },
    addNotes(state, action: PayloadAction<any>) {
      state.notes = action.payload;
    },
    reset: () => initialState
  }
});

export const { addClient, addContainer, addDestination, addDriver, addNotes, addOrigin, addPolicy, addPrice, addTruck, addWeight, addCurrency, reset } = shipmentSlice.actions;

export const shipmentSelector = (state: RootState) => state.shipmentSlice;

export default shipmentSlice;
