import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatData: [],
};

const chatDataSlice = createSlice({
    name: "chatData",
    initialState,
    reducers: {
        setChatData: (state, action) => {
            
            state.chatData = action.payload;
        },
    },
});

export const { setChatData } = chatDataSlice.actions;

export default chatDataSlice.reducer;