import React, { useState,useRef,useEffect } from 'react';
import { View, 
         Text, 
         TextInput, 
         TouchableOpacity, 
         StyleSheet, 
         Animated, 
         Easing, 
         Image ,
        Dimensions,
        } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import {  useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setToken } from '../redux/tokenSlice';

import { setUser } from '../redux/userSlice';
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons'  
import {set_IdUser, getIdUser} from '../data/idUser';

const {width, height} = Dimensions.get('window');


const LoginScreen = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const ip = '192.168.1.54'

  const [visible, setVisible] = React.useState(false);
  const [phone, setPhone] = useState('0399889699');
  const [password, setPassword] = useState('aaaaaaaaA1@');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [notification, setNotification] = useState('');

  const animetionLogo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animetionLogo, {
      toValue : 1,
      duration : 5000,
      useNativeDriver : true,
      easing : Easing.linear
    }).start();
  },[animetionLogo])

  function login(phone, password) {
    if (phone === '' || password === '') {
      setNotification('Vui lòng nhập đầy đủ thông tin');
      showModal();
      return;
    }
    else {
      const data = {
        phone: phone,
        pass: password
      }
      // console.log(data);
      axios.post('http://'+ip+':3000/login', data)
        .then((response) => {
          if (response.data.error) {
            setNotification(response.data.message);
            showModal();}
          else {
            dispatch(setUser(response.data.user));
            console.log(response.data.token);
            dispatch(setToken(response.data.token));
            set_IdUser(response.data.user.idUser);
            navigation.navigate('TabHome');
            //sau 9p thì gọi update token để duy trì token
            setTimeout(() => {
              const data = {
                token: response.data.token.refreshToken
              }
              axios.post('http://'+ip+':3000/updateAccessToken', data)
                .then((response) => {
                  console.log('Update token: ', response.data);
                  dispatch(setToken(response.data.token));
                })
                .catch((error) => {
                  console.log('Error: ', error);
                })
            }, 540000);
          }
        })
        .catch((error) => {
          console.log('Error: ', error);
          console.log('Error: ', error.response.data.message);
          setNotification(error.response.data.message);
          showModal();
        })
    }
  }
  

handleShowPassword = () => {
  setIsShowPassword(!isShowPassword);
}
handleLogin = () => {
    navigation.navigate('TabHome');
}
const showModal = () => {
  setVisible(true);

}
const hideModal = () => setVisible(false)

  return (
    <PaperProvider>
      <View style={styles.container}>
      <Image style={styles.backgroundImage} source={require('../assets/bg-login.png')}/>
      <View style={styles.inputContainer}>
        <Animated.View style={[styles.logo, {opacity : animetionLogo}]}>
          <Image style={styles.logoImg} source={require('../assets/logoSec.png')}/>
        </Animated.View>
        <View style={styles.inputWrapper}>
          <View style={styles.inputUserNameContainer}>
            <TextInput
              onChangeText={setPhone}
              placeholder = 'Phone number'
              placeholderTextColor = '#00000080'
              value="0399889699"
              style={styles.inputField} />
          </View>
          <View style={styles.inputPasswordContainer}>
            <TextInput 
              placeholder = 'Password'
              placeholderTextColor = '#00000080'
              style={styles.inputField} 
              secureTextEntry={!isShowPassword}
              value="aaaaaaaaA1@"
              onChangeText={setPassword}
              />
           <TouchableOpacity style={{
              position : 'absolute',
              right : 10,
              }}
              onPress={handleShowPassword}
              >
           <Ionicons name="eye-outline" size={24} color="#ffffff" />
           </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity 
            onPress={()=>{login(phone, password)}}
            style={styles.loginButton}>
              <Text style={{
                fontSize : 20,
                color : '#000000',
                alignSelf : 'center',
              }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.forgotContainer}>
          <TouchableOpacity
          onPress={()=>{navigation.navigate('ForgotPass')}}
          >
            <Text style={{
              fontSize : 15,
              color : '#ffffff',
              alignSelf : 'center',
            }}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={()=>{navigation.navigate('Register')}}
          >
            <Text style={{
              fontSize : 15,
              color : '#ffffff',
              alignSelf : 'center',
            }}> Sign Up</Text>
          </TouchableOpacity>
        </View>
    </View>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalLoginFail}>
            <View style={styles.modalContainer}>
              <FontAwesomeIcon icon={faFaceSadTear} size={50} color={'#000000'}/>
            <Text style={styles.textFailModal}>{notification}</Text>
            <TouchableOpacity
            style={{
              width : 100,
              height : 40,
              backgroundColor : '#BFEA7C',
              borderRadius : 10,
              justifyContent : 'center',
              marginTop : 20,
            }}
            onPress={hideModal}>
              <Text style={{
                fontSize : 20,
                color : '#000000',
                alignSelf : 'center',
              }}>OK</Text>
            </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    width : '100%',
    height : height,
  },
  backgroundImage : {
    width : width,
    height : height
  },
  inputContainer : {
    width : '90%',
    height : 450,
    backgroundColor : 'transparent',
    borderRadius : 10,
    position : 'absolute',
    alignSelf : 'center',
    marginTop : 50,
  },
  logo : {
    width : 150,
    height : 150,
    borderRadius : 100,
    alignSelf : 'center',
    marginTop : 50,
    elevation  : 30,
    justifyContent : 'center',
    alignItems : 'center',
  },
  logoImg :{
    alignSelf : 'center',
  },
  inputWrapper : {
    width : '100%',
    height : 250,
    backgroundColor : 'transparent',
    marginTop : 50,
    justifyContent  : 'center',
  },
  inputUserNameContainer : {
    width : '90%',
    height : 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    borderRadius : 10,
    alignSelf : 'center',
    elevation : 30,
  },
  inputPasswordContainer :{
    width : '90%',
    height : 50,
    backgroundColor: '#ffffff80', 
    borderRadius : 10,
    alignSelf : 'center',
    marginTop : 20,
    elevation : 30,
    justifyContent : 'center',
  },
  inputField : {
    width : '100%',
    height : '100%',
    paddingLeft : 20,
    fontSize : 20,
    color : 'black',
  },
  loginButton : {
    width : '90%',
    height : 50,
    backgroundColor : '#ffffff80',
    borderRadius : 10,
    alignSelf : 'center',
    marginTop : 40,
    elevation : 30,
    justifyContent : 'center',
  },
  forgotContainer :{
    width : '100%',
    height : 50,
    backgroundColor : 'transparent',
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center',
    position : 'absolute',
    bottom : 15,
  },
  modalLoginFail : {
    width: '95%',
      height: 200,
      backgroundColor: '#add8e6',
      alignSelf: 'center',
      borderRadius: 5,
      textAlignVertical: 'top',
      borderRadius: 15,
      padding: 10,
      elevation: 30,
      marginLeft: 5,
  },
  modalContainer : {
    width : '100%',
    height : '100%',
    backgroundColor : 'transparent',
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor : 'white',
    flexDirection : 'column',
  },
  textFailModal : {
    fontSize : 17,
    color : '#000000',
    marginVertical : 10,
  }
});

export default LoginScreen;
