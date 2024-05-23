import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { City, Country } from "./locationTypes";

interface locationState {
  city: City | null;
  country: Country | null;
}

const initialState: locationState = {
  city: null,
  country: null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state, action: PayloadAction<City | null>) => {
      state.city = action.payload;
    },
    setCountry: (state, action: PayloadAction<Country | null>) => {
      state.country = action.payload;
    },
  },
});

export default locationSlice.reducer;
export const { setCity, setCountry } = locationSlice.actions;
