import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'

const ForgotPass = () => {
  const navigation = useNavigation();



  const [phone, setPhone] = useState('');
  const [OTP, setOTP] = useState(Math.floor(100000 + Math.random() * 900000));
  const [confirmOTP, setConfirmOTP] = useState([]);
  const [showOTP, setShowOTP] = useState(false);
  const digits = OTP.toString().split('');
  const [isCorrect, setIsCorrect] = useState(false);

  function sendCode() {
    setShowOTP(true);
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Quên mật khẩu',
      headerTitleAlign: 'flex-start',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
      },
      headerStyle: {
        backgroundColor: '#3c3c3c',
        shadowColor: '#fff',
        elevation: 0,
      },
      headerLeft: () => {
        return (
          <View>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                navigation.goBack();
              }}>
              <FontAwesomeIcon icon={faArrowAltCircleLeft} size={25} color={'#fff'} />
            </TouchableOpacity>
          </View>
        )
      },
    });
  }, [navigation, OTP, confirmOTP, isCorrect, showOTP])

  return (
    <View style={styles.constainer}>
      <View style={styles.titleWrapper}>
        <Text
          style={styles.title}
        >
          Nhập số điện thoại của bạn để lấy lại mật khẩu
        </Text>
      </View>
    <View style={{width : '90%', marginTop : 20}}>
    <TextInput
        style={styles.textInput}
        placeholder="Nhập số điện thoại"
        keyboardType="numeric"
      />
    </View>
      <TouchableOpacity
        onPress={sendCode}
        style={styles.sendCodeButton}
      >
        <Text
          style={styles.titleButtonSendCode}
        >
          Gửi mã xác nhận
        </Text>
      </TouchableOpacity>
     {
        showOTP ? (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90%',
          }}>
          <View
            
          >
            <View style={styles.showOTPWrapper}>
            <View style={{width : '100%'}}>
              <TextInput style={[styles.textInput, {textAlign:"center"}]}>
                {digits[0]}
              </TextInput>
            </View>
            </View>
          </View>
          </View>
        ) : null
     }
      {
        isCorrect ? (
          <TouchableOpacity
            style={[{backgroundColor : 'green'},styles.buttonResetPass]}
          >
            <Text
              style={styles.titleButtonSendCode}
            >
              Tiếp tục
            </Text>
          </TouchableOpacity>
        ) : <TouchableOpacity
        style={[{backgroundColor : '#3c3c3c'},styles.buttonResetPass]}
      >
        <Text
          style={styles.titleButtonSendCode}
        >
          Tiếp tục
        </Text>
      </TouchableOpacity>
      }
    </View>
  )
}

export default ForgotPass

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput : {
    width : '100%',
    height : 50,
    backgroundColor : '#E5E5E5',
    borderRadius : 10,
    paddingLeft : 10,
  },
  titleWrapper : {
    width : '90%',
    justifyContent : 'center',
    alignItems : 'center',
    alignContent : 'center',
  },
  title : {
    fontSize : 17,
    fontWeight : 'bold',
    alignSelf : 'center',
  },
  sendCodeButton : {
    width : '90%',
    height : 50,
    backgroundColor : '#3c3c3c',
    borderRadius : 10,
    justifyContent : 'center',
    marginTop : 20,
  },
  titleButtonSendCode : {
    fontSize : 17,
    fontWeight : 'bold',
    color : '#fff',
    alignSelf : 'center',
  },
  showOTPWrapper :{
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
    marginTop : 20,
    width : '100%',
    alignSelf : 'center',
  },
  buttonResetPass : {
    width : '90%',
    height : 50,
    // backgroundColor : '#3c3c3c',
    borderRadius : 10,
    justifyContent : 'center',
    marginTop : 20,
  },
})