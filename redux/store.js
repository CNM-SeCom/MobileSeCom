import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeSlice';
import themeReducer from './themeSlice';
import accountReducer from './accountSlice';
import userReducer from './userSlice';
import tokenReducer from './tokenSlice';
import chatDataReducer from './chatDataSlice';
import messageReducer from './messageSlice';
import listChatReducer from './listChatSlice';
import chatIdReducer from './chatIdSlice';
import currentIdSlice from './currentIdSlice';
import checkTypingSlice from './checkTypingSlice';
import callStateSlice from './callStateSlice';
import groupInfoSlice from './groupInfoSlice';

const store = configureStore({
  reducer: {
    mode: modeReducer,
    theme: themeReducer,
    account: accountReducer,
    user: userReducer,
    token: tokenReducer,
    chatData: chatDataReducer,
    message: messageReducer,
    listChat: listChatReducer,
    chatId: chatIdReducer,
    currentId: currentIdSlice,
    checkTyping: checkTypingSlice,
    groupInfo: groupInfoSlice,
  },
});

export default store;
