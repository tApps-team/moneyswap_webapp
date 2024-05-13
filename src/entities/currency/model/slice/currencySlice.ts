import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrencyLang, CurrencySchema } from "../types/currency";
import { type Currency } from "../types/currency";
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
    setGetCurrency: (state, action: PayloadAction<CurrencyLang | null>) => {
      state.getCurrency = action.payload;
    },
    setGiveCurrency: (state, action: PayloadAction<CurrencyLang | null>) => {
      state.giveCurrency = action.payload;
    },
    setGetCashCurrency: (state, action: PayloadAction<CurrencyLang | null>) => {
      state.getCashCurrency = action.payload;
    },
    setGiveCashCurrency: (
      state,
      action: PayloadAction<CurrencyLang | null>
    ) => {
      state.giveCashCurrency = action.payload;
    },
  },
});
export const { actions: currencyActions } = currencySlice;
export const { reducer: currencyReducer } = currencySlice;
