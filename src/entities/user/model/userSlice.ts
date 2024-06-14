import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./userTypes";

interface userState {
  user: User | null;
  user_id: number | null;
}

const initialState: userState = {
  user: null,
  user_id: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserId: (state, action: PayloadAction<number | null>) => {
      state.user_id = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { setUser, setUserId } = userSlice.actions;
