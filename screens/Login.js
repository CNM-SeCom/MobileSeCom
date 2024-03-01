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
const {width, height} = Dimensions.get('window');



const LoginScreen = () => {

  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);

  const animetionLogo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animetionLogo, {
      toValue : 1,
      duration : 5000,
      useNativeDriver : true,
      easing : Easing.linear
    }).start();
  },[animetionLogo])

handleShowPassword = () => {
  setIsShowPassword(!isShowPassword);
}

handleLogin = () => {
    navigation.navigate('TabHome');
}

  return (

    <View style={styles.container}>
      <Image style={styles.backgroundImage} source={require('../assets/bg-login.png')}/>
      <View style={styles.inputContainer}>
        <Animated.View style={[styles.logo, {opacity : animetionLogo}]}>
          <Image style={styles.logoImg} source={require('../assets/logo.png')}/>
        </Animated.View>
        <View style={styles.inputWrapper}>
          <View style={styles.inputUserNameContainer}>
            <TextInput
              placeholder = 'Username'
              placeholderTextColor = '#00000080'
              style={styles.inputField} />
          </View>
          <View style={styles.inputPasswordContainer}>
            <TextInput 
              placeholder = 'Password'
              placeholderTextColor = '#00000080'
              style={styles.inputField} 
              secureTextEntry={!isShowPassword}
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
            onPress={handleLogin}
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
          <TouchableOpacity>
            <Text style={{
              fontSize : 15,
              color : '#ffffff',
              alignSelf : 'center',
            }}> Sign Up</Text>
          </TouchableOpacity>
        </View>
    </View>
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
    width : 150,
    height : 150,
    borderRadius : 100,
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
  }
  
});

export default LoginScreen;
