import React, { useEffect } from 'react';
import { List } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPalette, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Switch } from 'react-native-paper';
import { View, StyleSheet,Text } from 'react-native';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { toggleMode } from '../redux/modeSlice';
import { setToken } from '../redux/tokenSlice';
import { setThemeColors } from '../redux/themeSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { setUser } from '../redux/userSlice';
import { useNavigation } from '@react-navigation/native';

const Setting = () => {


  const navigation = useNavigation();

  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);


  const [isDarkMode, setIsDarkMode] = React.useState(true);
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

  const [isDefaultMode, setIsDefaultMode] = React.useState(false);
  const onToggleDefaultMode = () => {
    setIsDefaultMode(!isDefaultMode)
    setIsLightMode(false)
    setIsDarkMode(false)
    handleModeChange('default')
  };
  
  const mode = useSelector((state) => state.mode.mode);
  const token = useSelector((state) => state.token.token);

  console.log("token on setting");
  console.log(token);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.accessToken}` // Thêm token vào tiêu đề Authorization
    }
  };


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

  const user = useSelector((state) => state.user.user);
  console.log("user on log");
  console.log(user);

  const handleLogout = () => {
    dispatch(setUser(null));
    axios.post('http://192.168.130.78:3000/logout', {idUser: user.idUser}, config)
    navigation.replace('Login');
  };

  return (
   <View style={[styles.container, { backgroundColor: colors.background }]}>
     <List.Section 
     title="Setting">
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
    <TouchableOpacity 
    onPress={handleLogout}
    style={[
      {backgroundColor : colors.background},
      styles.logOutButton]}>
      <Text style={[
        {color: colors.text},
        styles.textLogout]}>
        Logout
      </Text>
      <FontAwesomeIcon style={styles.textLogout} icon={faRightFromBracket} size={25} color={colors.text}/>
    </TouchableOpacity>
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
  textLogout : {
    fontSize : 20,
    alignSelf : 'center',
  },
  logOutButton : {
    width : '100%',
    height : 50,
    borderRadius : 10,
    justifyContent : 'space-between',
    flexDirection : 'row',
    paddingLeft : 20,
    paddingRight : 20,
    borderTopWidth : 1,
    borderColor : 'white',
    
  }
});
