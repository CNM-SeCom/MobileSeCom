// darkModeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: 'default', // default, dark, light
};

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    toggleMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleMode } = modeSlice.actions;

export default modeSlice.reducer;
