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
import { Provider, useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAccount } from '../redux/accountSlice';
import { setUser } from '../redux/userSlice';
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons'  

const {width, height} = Dimensions.get('window');

const LoginScreen = () => {
  const account = useSelector(account => account.account);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [visible, setVisible] = React.useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
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
    } else {
      const data = {
        phone: phone,
        pass: password
      }
      // console.log(data);s
      axios.post('http://192.168.1.7:3000/login', data)
        .then((response) => {
          console.log('Response: ', response.data);
          if (response.data.error) {
            setNotification(response.data.error);
            showModal();
          } else {
            dispatch(setAccount(response.data.account));
            dispatch(setUser(response.data.user));
            console.log('Account: ', response.data.account);
            console.log('User: ', response.data.user);
            console.log('đang đăng nhập thành công');
            navigation.navigate('TabHome');
          }
        })
        .catch((error) => {
          console.log('Error: ', error);
          setNotification('Tài khoản hoặc mật khẩu không đúng');
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
              style={styles.inputField} />
          </View>
          <View style={styles.inputPasswordContainer}>
            <TextInput 
              placeholder = 'Password'
              placeholderTextColor = '#00000080'
              style={styles.inputField} 
              secureTextEntry={!isShowPassword}
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
          <TouchableOpacity>
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
