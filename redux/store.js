import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeSlice';
import themeReducer from './themeSlice';
import accountReducer from './accountSlice';
import userReducer from './userSlice';
import tokenReducer from './tokenSlice';
import chatDataReducer from './chatDataSlice';

const store = configureStore({
  reducer: {
    mode: modeReducer,
    theme: themeReducer,
    account: accountReducer,
    user: userReducer,
    token: tokenReducer,
    chatData: chatDataReducer,
  },
});

export default store;
