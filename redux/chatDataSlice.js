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
        addChatData: (state, action) => {
            const newChatData = [...state.chatData, action.payload];
            console.log('====================================');
            console.log('ChatData sau khi cập nhật:', newChatData);
            console.log('====================================');
            state.chatData = newChatData;
        }
    },
});

export const { setChatData,addChatData } = chatDataSlice.actions;

export default chatDataSlice.reducer;