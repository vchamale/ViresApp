import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../configureStore';

const pageControlSlice = createSlice({
  name: 'pageControlSlice',
  initialState: {
    isSingleShipmentCreatePage: false,
  },
  reducers: {
    setSingleShipmentCreatePage(state, action: PayloadAction<boolean>) {
      state.isSingleShipmentCreatePage = action.payload;
    },
  },
});

export const { setSingleShipmentCreatePage } = pageControlSlice.actions;

export const pageControlSelector = (state: RootState) => state.pageControlSlice;

export default pageControlSlice;
