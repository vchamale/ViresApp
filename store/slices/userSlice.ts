import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

const initialState: any = {
  name: ''
};


const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    addName(state, action: PayloadAction<any>) {
      state.name = action.payload;
    }
  }
});

export const { addName } = userSlice.actions;

export const shipmentSelector = (state: RootState) => state.userSlice;

export default userSlice;
