import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import  ip  from '../data/ip'
import { Modal, Portal, PaperProvider } from 'react-native-paper';


const ForgotPass = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const route = useRoute().params;  
  const [type , setType] = useState(route.type);
  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);
  

 

  useEffect(() => {
    if(route.email){
      setEmail(route.email);
      setType(route.type);
    }
  }, [route])

  const sendOTP = async(email) => {
    console.log('sendOTP', email);
    const data = {
      email: email,
    }
    await axios.post('http://' + ip + ':3000/sendOTP', data)
      .then(res => {
        if (res.data.success === true) {
          // setIsCorrect(true);
          console.log('sendOTP', res.data);
        }
      })
      .catch(err => {
        console.log('sendOTP', err);
      })
  }

const showModalNotify = (value) => {
  setShowModal(value);
}

  const checkOTP = async() => {
    const data = {
      email : email,
      otp: otp,
    }
    await axios.post('http://' + ip + ':3000/verifyOTP', data)
      .then(res => {
        if (res.data.success === true) {
          // setIsCorrect(true);
          console.log('checkOTP', res.data);
          navigation.navigate('ResetPass',{type:type})
        }
      })
      .catch(err => {
        console.log('checkOTP', err);
        showModalNotify(true);
      })
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Nhận OTP',
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
  }, [navigation])

  return (
    <PaperProvider>
      <View style={styles.constainer}>
      <View style={styles.titleWrapper}>
        <Text
          style={styles.title}
        >
          Nhập email của bạn để lấy lại mật khẩu
        </Text>
      </View>
    <View style={{width : '90%', marginTop : 20}}>
    <TextInput
        style={styles.textInput}
        placeholder="Nhập email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
    </View>
      {
        email ? (
          <TouchableOpacity
        onPress={()=>{sendOTP(email); setShowOTPInput(true)}}
        style={styles.sendCodeButton}
      >
        <Text
          style={styles.titleButtonSendCode}
        >
          Gửi mã xác nhận
        </Text>
      </TouchableOpacity>
        ):(
          <View
          
        onPress={()=>{sendOTP(email); setShowOTPInput(true)}}
        style={styles.sendCodeButton}
      >
        <Text
          style={styles.titleButtonSendCode}
        >
          Gửi mã xác nhận
        </Text>
      </View>
        )
      }
     {
        showOTPInput ? (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '90%',
          }}>
          <View
            //truongbinhtriet110202@gmail.com
          >
            <View style={styles.showOTPWrapper}>
            <View style={{width : '100%'}}>
              <TextInput 
              onChangeText={(text) => setOtp(text)}
              style={[styles.textInput, {textAlign:"center"}]}>
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
            onPress={() => {
              navigation.navigate('ResetPass',{type:type})}}
              style={[{backgroundColor : 'green'},styles.buttonResetPass]}
          >
            <Text
              style={styles.titleButtonSendCode}
            >
              Tiếp tục
            </Text>
          </TouchableOpacity>
        ) : <TouchableOpacity
        onPress={()=>{
          // navigation.navigate('ResetPass',{type:type})}}
          checkOTP()}}
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

      <Portal>
        <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
          <View style={{backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>Thông báo</Text>
            <Text style={{fontSize: 17, marginTop: 10, textAlign: 'center'}}>Mã OTP không chính xác</Text>
            <TouchableOpacity style={{backgroundColor: '#3c3c3c', padding: 10, borderRadius: 10, marginTop: 20}} onPress={() => setShowModal(false)}>
              <Text style={{fontSize: 17, color: 'white', textAlign: 'center'}}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

    </PaperProvider>
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