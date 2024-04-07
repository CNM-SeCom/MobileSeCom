// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkColors: {
    primary: '#BB86FC',
    background: 'black',
    card: '#3c3c3c',
    text: 'white',
    border: '#555555',
    icon: 'white',
    iconActive: 'white',
    iconInactive: '#3c3c3c',
  },
  lightColors: {
    primary: 'white',
    background: '#FFFFFF',
    card: 'white',
    text: 'black',
    border: '#CCCCCC',
    icon: 'black',
    iconActive: 'black',
    iconInactive: '#3c3c3c',
    background:'#C3F8FF'

  }
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeColors: (state, action) => {
      state.colors = action.payload;
    },
  },
});

export const { setThemeColors } = themeSlice.actions;

export default themeSlice.reducer;
