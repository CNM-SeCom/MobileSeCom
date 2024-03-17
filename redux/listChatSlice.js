import { createSlice } from "@reduxjs/toolkit";

const listChatSlice = createSlice({
    name: "listChat",
    initialState: {
        listChat: [],
    },
    reducers: {
        setListChat: (state, action) => {
            state.listChat = action.payload;
        },
    },
});

export const { setListChat } = listChatSlice.actions;
// export const selectListChat = (state) => state.listChat.listChat;
export default listChatSlice.reducer;
