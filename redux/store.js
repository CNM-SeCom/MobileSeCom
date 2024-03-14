import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeSlice';
import themeReducer from './themeSlice';
import accountReducer from './accountSlice';
import userReducer from './userSlice';
import tokenReducer from './tokenSlice';
import chatDataReducer from './chatDataSlice';
import messageReducer from './messageSlice';

const store = configureStore({
  reducer: {
    mode: modeReducer,
    theme: themeReducer,
    account: accountReducer,
    user: userReducer,
    token: tokenReducer,
    chatData: chatDataReducer,
    message: messageReducer,
  },
});

export default store;
