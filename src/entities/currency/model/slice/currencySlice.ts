import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Currency, CurrencySchema } from "../types/currency";

const initialState: CurrencySchema = {
  getCurrency: null,
  giveCurrency: null,
  getCashCurrency: null,
  giveCashCurrency: null,
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setGetCurrency: (state, action: PayloadAction<Currency | null>) => {
      state.getCurrency = action.payload;
    },
    setGiveCurrency: (state, action: PayloadAction<Currency | null>) => {
      state.giveCurrency = action.payload;
    },
    setGetCashCurrency: (state, action: PayloadAction<Currency | null>) => {
      state.getCashCurrency = action.payload;
    },
    setGiveCashCurrency: (state, action: PayloadAction<Currency | null>) => {
      state.giveCashCurrency = action.payload;
    },
    resetCashCurrency: (state) => {
      (state.giveCashCurrency = null), (state.getCashCurrency = null);
    },
    resetNoCashCurrency: (state) => {
      (state.giveCurrency = null), (state.getCurrency = null);
    },
  },
});
export const { actions: currencyActions } = currencySlice;
export const { reducer: currencyReducer } = currencySlice;
