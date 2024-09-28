import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

const counterSlice = createSlice({
  name: 'counterSlice',
  initialState: {
    counter: 0
  },
  reducers: {
    increment(state, action: PayloadAction<number>) {
      state.counter = state.counter + action.payload;
    },
    decrement(state, action: PayloadAction<number>) {
      state.counter = state.counter - action.payload;
    }
  }
});

export const { increment, decrement } = counterSlice.actions;

export const counterSelector = (state: RootState) => state.counterSlice.counter;

export default counterSlice;
