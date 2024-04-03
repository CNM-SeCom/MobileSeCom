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
            //sort lại theo id giảm dần
        },
        addChatData: (state, action) => {
            const newChatData = [...state.chatData, action.payload];
            state.chatData = newChatData;
            //sort lại theo id
        },
        sortChatData: (state) => {
            state.chatData.sort((a, b) => b._id - a._id);
        },
    },
});

export const { setChatData,addChatData,sortChatData } = chatDataSlice.actions;

export default chatDataSlice.reducer;