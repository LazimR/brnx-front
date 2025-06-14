import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../constants/Interfaces"

const initialState: User = {
  id: 0,
  name: ""
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action:PayloadAction<User>) => {
            state.id = action.payload.id;
            state.name = action.payload.name;
        },
        clearUser: (state) => {
            state.id = 0;
            state.name = "";
        },
    }
})

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;