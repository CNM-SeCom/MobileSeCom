// MyComponent.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMode } from '../redux/modeSlice';
import { setThemeColors } from '../redux/themeSlice';

const MyComponent = () => {
  const mode = useSelector((state) => state.mode.mode);
  const colors = useSelector((state) => {
    switch (mode) {
      case 'dark':
        return state.theme.darkColors;
      case 'light':
        return state.theme.lightColors;
      default:
        return state.theme.defaultColors;
    }
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setThemeColors(colors));
  }, [mode, dispatch, colors]);

  const handleModeChange = (newMode) => {
    dispatch(toggleMode(newMode));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>Hello, World!</Text>
      <Button title="Set Dark Mode" onPress={() => handleModeChange('dark')} />
      <Button title="Set Light Mode" onPress={() => handleModeChange('light')} />
      <Button title="Set Default Mode" onPress={() => handleModeChange('default')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MyComponent;
