import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
    name: "call",
    initialState: {
        call: false,
    },
    reducers: {
        setCall: (state, action) => {
            state.call = action.payload;
        },
    },
});

export const { setCall } = callSlice.actions;