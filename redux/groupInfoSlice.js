import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    groupInfo: null,
};

const groupInfoSlice = createSlice({
    name: "groupInfo",
    initialState,
    reducers: {
        setGroupInfo: (state, action) => {
            state.groupInfo = action.payload;
        },
    },
});

export const { setGroupInfo } = groupInfoSlice.actions;
export default groupInfoSlice.reducer;