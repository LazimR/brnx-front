import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Provider } from "../../constants/Interfaces";

const initialState: Provider[] = [];

const providerSlice = createSlice({
    name: "providers",
    initialState,
    reducers: {
        setProviders: (state, action: PayloadAction<Provider[]>) => {
            return action.payload;
        },

        addProvider: (state, action: PayloadAction<Provider>) => {
            state.push(action.payload);
        },

        clearProviders: () => {
            return [];
        },
    }
});

export const { setProviders, addProvider, clearProviders } = providerSlice.actions;
export default providerSlice.reducer;
