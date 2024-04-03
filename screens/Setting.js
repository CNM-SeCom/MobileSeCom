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
import ip from '../data/ip';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Setting = () => {


  const navigation = useNavigation();

  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);


  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const onToggleDarkMode = () => {
    if(isDarkMode === false) {
      setIsDarkMode(true)
      setIsLightMode(false)
      handleModeChange('dark')
    }
  };

  const [isLightMode, setIsLightMode] = React.useState(false);
  const onToggleLightMode = () => {
    if(isDarkMode === true) {
      setIsDarkMode(false)
      setIsLightMode(true)
      handleModeChange('light')
    }
  };

  const mode = useSelector((state) => state.mode.mode);
  const token = useSelector((state) => state.token.token);
  const user = useSelector((state) => state.user.user);

  const clearLoginState = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('idUser');
      console.log('Trạng thái đăng nhập đã được xóa.');
    } catch (error) {
      console.error('Lỗi khi xóa trạng thái đăng nhập:', error);
    }
  };



  let config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.accessToken}` // Thêm token vào tiêu đề Authorization
    }
  };


  const colors = useSelector((state) => {
    switch (mode) {
      case 'dark':
        return state.theme.darkColors;   
      default:
        return state.theme.lightColors;
    }
  });;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setThemeColors(colors));
  }, [mode, dispatch, colors, user]);

  const handleModeChange = (newMode) => {
    dispatch(toggleMode(newMode));
  };



  const handleLogout = () => {
    axios.post('http://'+ip+':3000/logout', { idUser: user.idUser }, config)
      .then((response) => {
        dispatch(setToken({}));
        dispatch(setUser(null));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        clearLoginState();
      })
      .catch((error) => {
        console.log(error);
      });
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
