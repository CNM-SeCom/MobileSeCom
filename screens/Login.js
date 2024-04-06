import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setToken } from '../redux/tokenSlice';

import { setUser } from '../redux/userSlice';
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFaceSadTear } from '@fortawesome/free-solid-svg-icons'
import { set_IdUser, getIdUser } from '../data/idUser';
import ip from '../data/ip';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');


const LoginScreen = () => {

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  // const [refreshToken, setRefreshToken] = useState('');
  // const [idUser, setIdUser] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [visible, setVisible] = React.useState(false);
  const [phone, setPhone] = useState('0919437181');
  const [password, setPassword] = useState('aaaaaaaaA2@');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [notification, setNotification] = useState('');
  const [incorect, setIncorect] = useState(0);
  const [email, setEmail] = useState('');

  // navigation.navigate('ResetPass', { email: email,id: user.id ,type: 'changePass' }); 

  useEffect(() => {
    if(incorect == 3){
        navigation.navigate('ConfirmOTP',  {email: email, type : 'forgotPass'});
        setEmail('');
        showModal(false);
      }
  }, [email])


  const animetionLogo = useRef(new Animated.Value(0)).current;
  const saveLoginState = async (token, id) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('idUser', id);
      console.log('Trạng thái đăng nhập đã được lưu.');
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái đăng nhập:', error);
    }
  };


  useEffect(() => {
    Animated.timing(animetionLogo, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: true,
      easing: Easing.linear
    }).start();
  }, [animetionLogo])


  async function getEmailByPhone(phone) {
    const data = {
      phone: phone
    }
    await axios.post('http://' + ip + ':3000/findEmailByPhone', data)
      .then((response) => {
        setEmail(response.data.data);
        return response.data.data;
      })
      .catch((error) => {
        console.log('Error: ', error);
      }
      )
  }

  function updateToken(refreshToken, idUser) {
    setTimeout(() => {
      const data = {
        refreshToken: refreshToken,
        idUser: idUser
      }
      console.log('data update token: ', data);
      axios.post('http://' + ip + ':3000/updateAccessToken', data)
        .then((response) => {
          console.log('Update token: ', response.data);
          dispatch(setToken(response.data));
          if (user !== null) {
            updateToken(response.data.refreshToken, idUser)
          }
        })
        .catch((error) => {
          console.log('lỗi update token');
          console.log('Error: ', error);
        })
    }, 540000);
  }


  useEffect(() => {
    autoNavigateForgotPass();

  }, [incorect])

  const autoNavigateForgotPass = async() => {
    if (incorect == 3) {
      const result =  await getEmailByPhone(phone);
      setIncorect(0);
    }
  }

  const navigateForgotPass = () => {
        navigation.navigate('ConfirmOTP', { email: "", type: 'forgotPass' });
        setIncorect(0);
  }

  async function login(phone, password) {
    if (phone === '' || password === '') {
      setNotification('Vui lòng nhập đầy đủ thông tin');
      showModal(true);
      return;
    }
    else {
      const data = {
        phone: phone,
        pass: password
      }
      await axios.post('http://' + ip + ':3000/login', data)
        .then((response) => {
          if (response.data.error) {
            setIncorect(incorect + 1);
            if (response.data.error === 'failed') {
              setNotification("Thông tin đăng nhập không chính xác, bạn còn" + 3 - incorect + "thử lại");
            }
            setNotification(response.data.error);
            showModal(true);
          }
          else {
            dispatch(setUser(response.data.user));
            console.log(response.data.token);
            dispatch(setToken(response.data.token));
            set_IdUser(response.data.user.idUser)
            navigation.navigate('TabHome');
            // sau 9p thì gọi update token để duy trì token
            updateToken(response.data.token.refreshToken, response.data.user.idUser);
            saveLoginState(response.data.token.refreshToken,response.data.user.idUser );
          }
        })
        .catch((error) => {
          console.log('Error: ', error);
          console.log('Error: ', error.response.data.message);
          setIncorect(incorect + 1);
          console.log(error.response.data.message)
          const count = parseInt(3 - (incorect+1))
          if (error.response.data.message == 'failed') {
            setNotification("Thông tin đăng nhập không chính xác, bạn còn " + count + " thử lại");
          }
         else {
          setNotification(error.response.data.message);
         }

          console.log('incorect: ', incorect);
          showModal(true);
        })
    }
  }

  

  handleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  }
  handleLogin = () => {
    navigation.navigate('TabHome');
  }
  const showModal = (boolean) => {
    setVisible(boolean);

  }
  const hideModal = () => setVisible(false)

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.backgroundImage} />
        <View style={styles.inputContainer}>
          {/* <Animated.View style={[styles.logo, { opacity: animetionLogo }]}>
            <Image style={styles.logoImg} source={require('../assets/logo_com.png')} />
          </Animated.View> */}
          <View style={{ alignSelf: "center" }}>
            <Image style={{  width : 250, height : 300 }} source={require('../assets/logo_SeCom.png')} />
          </View>
          <View style={styles.inputWrapper}>

            <View style={styles.inputUserNameContainer}>

              <TextInput
                onChangeText={setPhone}
                placeholder='Số điện thoại'
                placeholderTextColor='#00000080'
                value="0919437181"
                style={styles.inputField} />
            </View>
            <View style={styles.inputPasswordContainer}>
              <TextInput
                placeholder='aaaaaaaaA2@'
                placeholderTextColor='#00000080'
                style={styles.inputField}
                secureTextEntry={!isShowPassword}
                
                onChangeText={setPassword}
              />
              <TouchableOpacity style={{
                position: 'absolute',
                right: 10,
              }}
                onPress={handleShowPassword}
              >
                <Ionicons name="eye-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View >
              <TouchableOpacity
                onPress={() => { login(phone, password) }}
                style={styles.loginButton}>
                <Text style={{
                  fontSize: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#000000',
                  alignSelf: 'center',
                }}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { navigateForgotPass() }}
              >
                <Text style={{
                  top: 20,
                  fontSize: 15,
                  textDecorationLine: 'underline',
                  color: 'black',
                  alignSelf: 'center',
                }}>Quên mật khẩu?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.forgotContainer}>
          <TouchableOpacity
            style={{
              height: 35, width: 220, borderRadius: 2.5, justifyContent: "center", alignItems: "center",
              borderColor: "gray ",
            }}
            onPress={() => { navigation.navigate('Register') }}
          >
            <Text style={{
              fontSize: 15,
              color: 'black',
              alignSelf: 'center',
              textDecorationLine: 'underline',
            }}>Đăng ký tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalLoginFail}>
          <View style={styles.modalContainer}>
            <FontAwesomeIcon icon={faFaceSadTear} size={50} color={'#000000'} />
            <Text style={styles.textFailModal}>{notification}</Text>
            <TouchableOpacity
              style={{
                width: 100,
                height: 40,
                backgroundColor: '#BFEA7C',
                borderRadius: 10,
                justifyContent: 'center',
                marginTop: 20,
              }}
              onPress={hideModal}>
              <Text style={{
                fontSize: 15,
                color: '#000000',
                alignSelf: 'center',
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
    width: '100%',
    height: height,
  },
  backgroundImage: {
    width: width,
    height: height,
    backgroundColor: "#C3F8FF"
  },
  inputContainer: {

    width: '90%',
    height: 450,
    backgroundColor: 'transparent',
    borderRadius: 10,
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 50,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 100,
    alignSelf: 'center',

    elevation: 30,
    justifyContent: 'center',
    alignItems: 'center',

  },
  logoImg: {
    alignSelf: 'center',
  },
  inputWrapper: {
    width: '100%',
    height: 150,
    backgroundColor: 'transparent',
    marginTop: 80,
    justifyContent: 'center',
  },
  inputUserNameContainer: {
    width: '90%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    alignSelf: 'center',
    elevation: 30,
    backgroundColor: 'white',
  },
  inputPasswordContainer: {
    width: '90%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
    elevation: 30,
    justifyContent: 'center',
  },
  inputField: {
    width: '100%',
    height: '100%',
    paddingLeft: 20,
    fontSize: 20,
    color: 'black',
  },
  loginButton: {
    width: '90%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 40,
    elevation: 30,
    justifyContent: 'center',
  },
  forgotContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 15,
  },
  modalLoginFail: {
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
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  textFailModal: {
    fontSize: 17,
    color: '#000000',
    marginVertical: 10,
  }
});

export default LoginScreen;
