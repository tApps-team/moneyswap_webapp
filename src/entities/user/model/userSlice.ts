import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./userTypes";

interface userState {
  user: User | null;
}

const initialState: userState = {
  user: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { setUser } = userSlice.actions;
