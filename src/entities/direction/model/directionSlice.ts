import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { directions } from "./directionTypes";

interface directionState {
  activeDirection: directions;
}

const initialState: directionState = {
  activeDirection: directions.noncash,
};

export const directionSlice = createSlice({
  name: "direction",
  initialState,
  reducers: {
    setActiveDirection: (state, action: PayloadAction<directions>) => {
      state.activeDirection = action.payload;
    },
  },
});

export default directionSlice.reducer;
export const { setActiveDirection } = directionSlice.actions;
