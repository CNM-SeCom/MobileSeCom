import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeSlice';
import themeReducer from './themeSlice';
import accountReducer from './accountSlice';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    mode: modeReducer,
    theme: themeReducer,
    account: accountReducer,
    user: userReducer,
  },
});

export default store;
