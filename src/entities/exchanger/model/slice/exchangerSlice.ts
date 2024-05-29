import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Exchanger } from "../exchangerTypes";

interface ExchangerState {
  exchanger: Exchanger | null;
}

const initialState: ExchangerState = {
  exchanger: null,
};

export const exchangerSlice = createSlice({
  name: "exchanger",
  initialState,
  reducers: {
    setActiveExchanger: (state, action: PayloadAction<Exchanger>) => {
      state.exchanger = action.payload;
    },
  },
});

export const { actions: exchangerActions } = exchangerSlice;
export const { reducer: exchangerReducer } = exchangerSlice;
