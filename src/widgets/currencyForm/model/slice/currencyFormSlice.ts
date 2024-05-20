import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  cashExchangersIsSuccess: false,
  noCashExchangersIsSuccess: false,
};

export const currencyFormSlice = createSlice({
  name: "currencyForm",
  initialState,
  reducers: {
    setCashExchangersIsSuccess: (state, action: PayloadAction<boolean>) => {
      state.cashExchangersIsSuccess = action.payload;
    },
    setNoCashExchangersIsSuccess: (state, action: PayloadAction<boolean>) => {
      state.noCashExchangersIsSuccess = action.payload;
    },
  },
});
export const { actions: currencyFormActions } = currencyFormSlice;
export const { reducer: currencyFormReducer } = currencyFormSlice;
