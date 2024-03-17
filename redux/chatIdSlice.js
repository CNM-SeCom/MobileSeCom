import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chatId: null,
};

const chatIdSlice = createSlice({
    name: 'chatId',
    initialState,
    reducers: {
        setChatId: (state, action) => {
            state.chatId = action.payload;
        },
    },
});

export const { setChatId } = chatIdSlice.actions;

export default chatIdSlice.reducer;