import { configureStore } from '@reduxjs/toolkit';
import modeReducer from './modeSlice';
import themeReducer from './themeSlice';

const store = configureStore({
  reducer: {
    mode: modeReducer,
    theme: themeReducer,
  },
});

export default store;
