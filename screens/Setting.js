import React, { useEffect } from 'react';
import { List } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPalette, faPaintbrush } from '@fortawesome/free-solid-svg-icons';
import { Switch } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';

import { useSelector, useDispatch } from 'react-redux';
import { toggleMode } from '../redux/modeSlice';
import { setThemeColors } from '../redux/themeSlice';

const Setting = () => {
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const onToggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    setIsLightMode(false)
    setIsDefaultMode(false)
    handleModeChange('dark')
  };

  const [isLightMode, setIsLightMode] = React.useState(false);
  const onToggleLightMode = () => {
    setIsLightMode(!isLightMode)
    setIsDarkMode(false)
    setIsDefaultMode(false)
    handleModeChange('light')
  };

  const [isDefaultMode, setIsDefaultMode] = React.useState(true);
  const onToggleDefaultMode = () => {
    setIsDefaultMode(!isDefaultMode)
    setIsLightMode(false)
    setIsDarkMode(false)
    handleModeChange('default')
  };

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
     <List.Section title="Setting">
      <List.Accordion
        title="Color Theme"
        expanded={expanded}
        onPress={handlePress}
        titleStyle={[
          styles.title,{
          color: colors.text,
        }]}
        style={{
          backgroundColor: colors.background,
        }}
        left={props => <List.Icon {...props} icon={() => (
          <FontAwesomeIcon icon={faPalette} size={25} color={colors.text} />
        )} />}
      >
        <List.Item title="Light mode" 
          right={() => (
            <Switch
              value={isLightMode}
              onValueChange={onToggleLightMode}
            />
          )}
          titleStyle={[
            styles.titleOption,
            { color: colors.text },
          ]}        />
        <List.Item title="Dark mode" 
          right={() => (
            <Switch
              value={isDarkMode}
              onValueChange={onToggleDarkMode}
            />
          )}
          titleStyle={[
            styles.titleOption,
            { color: colors.text },
          ]}        />
        <List.Item title="Default theme mode" 
          right={() => (
            <Switch
              value={isDefaultMode}
              onValueChange={onToggleDefaultMode}
            />
          )}
          titleStyle={[
            styles.titleOption,
            { color: colors.text },
          ]}
        />
      </List.Accordion>
    </List.Section>
   </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleOption: {
    fontSize: 16,
    paddingLeft: 30,
  },
});
