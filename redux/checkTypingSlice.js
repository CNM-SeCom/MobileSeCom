import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    typing: false,
};

const checkTypingSlice = createSlice({
    name: "checkTyping",
    initialState,
    reducers: {
        setTyping: (state, action) => {
            state.typing = action.payload;
        },
    },
});

export const { setTyping } = checkTypingSlice.actions;

export default checkTypingSlice.reducer;