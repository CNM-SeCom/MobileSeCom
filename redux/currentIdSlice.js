import { createSlice } from "@reduxjs/toolkit";

const currentIdSlice = createSlice({
    name: "currentId",
    initialState: {
        currentId: "",
    },
    reducers: {
        setCurrentId: (state, action) => {
            state.currentId = action.payload;
        },
    },
});

export const { setCurrentId } = currentIdSlice.actions;

export default currentIdSlice.reducer;