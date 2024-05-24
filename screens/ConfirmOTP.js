import { StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import axios from 'axios'
import ip from '../data/ip'
import { Modal, Portal, PaperProvider } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

//truongbinhtriet110202@gmail.com
const ForgotPass = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [resend, setResend] = useState(false);
  const route = useRoute().params;
  const [phoneForgot, setPhoneForgot] = useState('');


  console.log('routee', route);

  const [type, setType] = useState(route.type);
  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [countdown, setCountdown] = useState();



  //countdown 1:30s
  const countDownOTP = () => {
    setTimeout(() => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
      if (countdown === 0) {
        setShowCountdown(false);
        setResend(true);
      }
    }, 1000);
  }



  useEffect(() => {
    if (showCountdown) {
      countDownOTP();
    }
    
  }, [showCountdown, countdown, resend, route.phone])

  useEffect(() => {
   
  }, [email])


  const renderCountdown = (boolean) => {
    if (boolean) {
      return (
        <View
          style={{
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 14, color: 'red', textAlign: 'center', marginTop: 20 }}>Mã OTP đã gửi về {email}</Text>
          <Text style={{ fontSize: 14, color: 'red', textAlign: 'center', marginTop: 20 }}>Mã OTP sẽ hết hạn sau {countdown} giây</Text>
          {renderContinueButton()}
        </View>
      )
    }
    else if (resend) {
      return (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20,

          }}
        >
          <Text style={{ fontSize: 17, color: 'red', textAlign: 'center', margin: 10 }}>Gửi lại mã OTP</Text>
          {renderContinueButton()}
        </View>
      )
    }
    else {
      return null;
    }
  }
  const register = () => {

    const phone = route.phone;
    const password = route.password;
    const name = route.name;
    const email = route.email;
    const dob = route.dob;
    const gender = route.gender



    console.log('Phone: ', phone);
    console.log('Password: ', password);

    if (phone.length < 10) {
      alert('Số điện thoại không hợp lệ');
    }
    // else if( phoneForgot =='' && email == '') {
    //     alert('Email không được để trống');
    // }
    else {
      const data = {
        phone: phone,
        pass: password,
        gender: gender,
        name: name,
        email: email,
        dob: dob,
      }
      console.log(data);
      axios.post('http://' + ip + '/create', data)
        .then((response) => {

            alert('Tạo tài khoản thành công');

        })
        .catch((error) => {
          console.log('Error: ', error.message);
          alert(error);
        })
    }
  }

  useEffect(() => {
    if (route.email) {
      setEmail(route.email);
      setType(route.type);
    }
  }, [route, email])

  const sendOTP = async (email) => {
    console.log('sendOTP', email);
    // if ( phone =='' || email == '') {
    //   alert('Email không được để trống');
    //   return;
    // }
    const data = {
      email: email,
    }
    await axios.post('http://' + ip + '/sendOTP', data)
      .then(res => {
        if (res.data.success === true) {
          // setIsCorrect(true);
          setCountdown(90);
          setShowCountdown(true);
          console.log('sendOTP', res.data);
        }
      })
      .catch(err => {
        console.log('sendOTP', err);
        alert('Email không tồn tại');
      })
  }

  const showModalNotify = (value) => {
    setShowModal(value);
  }

  // const renderInputOTP = () => {
  //   showOTPInput ? (

  //   ) : null
  // }

  const checkOTP = async () => {
    const data = {
      email: email,
      otp: otp,

    }
    await axios.post('http://' + ip + '/verifyOTP', data)
      .then(res => {
        if (res.data.success === true) {
          setIsCorrect(true);
          console.log('checkOTP', res.data);
          if (route.type == 'register') {
            register()
            navigation.navigate('Login');

          }
          else {
            if (route.phone) {
              navigation.navigate('ResetPass', { email: email, type: type, phone: route.phone });
            }
            else {
              navigation.navigate('ResetPass', { email: email, type: type, phone: phoneForgot });
            }

          }
        }
      })
      .catch(err => {
        console.log('checkOTP', err);
        showModalNotify(true);

      })
  }

  async function getEmailByPhone(phone) {
    const data = {
      phone: phone
    }
    await axios.post('http://' + ip + '/findEmailByPhone', data)
      .then((response) => {
        setEmail(response.data.data);
        console.log('email', email);
        return response.data.data;
      })
      .catch((error) => {
        console.log('Error: ', error);
      }
      )
  }

  const renderContinueButton = () => {
    if (route.type == 'register') {
      return (
        <View
          style={[{ width: '100%', alignItems: 'center' }]}
        >
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
                <View style={{ width: '100%' }}>
                  <TextInput
                    onChangeText={(text) => setOtp(text)}
                    placeholder="Nhập mã OTP"
                    style={[styles.textInput, { textAlign: "center" }]}>
                  </TextInput>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              checkOTP();

            }}
            style={[{
              backgroundColor: '#3c3c3c', height: 50,
              // backgroundColor : '#3c3c3c',
              borderRadius: 10,
              width: '90%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }]}
          >
            <Text
              style={styles.titleButtonSendCode}
            >
              Tiếp tục
            </Text>
          </TouchableOpacity>
        </View>
      )
    }
    else {
      return (
        <View
          style={[{ width: '100%', alignItems: 'center', backgroundColor: 'pink', flex: 1, justifyContent: "flex-start" }]}
        >
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
                <View style={{ width: '100%' }}>
                  <TextInput
                    onChangeText={(text) => setOtp(text)}
                    placeholder="Nhập mã OTP"
                    style={[styles.textInput, { textAlign: "center", marginTop: 100 }]}>
                  </TextInput>
                </View>
              </View>
            </View>
          </View>
          <View style={{ width: "100%", alignItems: 'center', marginTop: 70, }}>
            <TouchableOpacity
              onPress={() => {
                checkOTP()
              }}
              style={[{
                backgroundColor: '#3c3c3c',
                width: '90%',

                height: 50,
                // backgroundColor : '#3c3c3c',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }]}
            >
              <Text
                style={styles.titleButtonSendCode}
              >
                Tiếp tục
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      )
    }
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
              style={{ marginLeft: 10 }}
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
            Nhập thông tin của bạn để lấy OTP
          </Text>
        </View>
        <View style={{ width: '90%', marginVertical: 20 }}>
          {
            route.phone ? (<TextInput
              style={[{}, styles.textInput]}
              textContentType='emailAddress'
              placeholder="Nhập email"
              {...(route.email ? { value: route.email } : {})  }
              onChangeText={(text) => {
                setEmail(text)
                console.log('email', email);
              }}


            />) : (<TextInput
              style={[{}, styles.textInput]}
              placeholder="Nhập số điện thoại"
              onChangeText={(text) => {
                setPhoneForgot(text)
                console.log('email', phoneForgot);
              }}

            />)}
            {/* <TextInput
              style={[{}, styles.textInput]}
              placeholder="Nhập số điện thoại"
              onChangeText={(text) => {
                setPhoneForgot(text)
                console.log('email', phoneForgot);
              }}

            /> */}
        </View>
        {
          email || phoneForgot ? (
            <View
              style={[{
                width: '100%',
                alignItems: 'center',
              }]}
            >
              <TouchableOpacity
                onPress={async () => {

                  if (email) {
                    sendOTP(email);
                    setShowOTPInput(true)
                  }
                  else {

                    //goi api lay email tu phone sau đó promise sendOTP

                    // sendOTP(res.data.data);
                    {
                      const data = {
                        phone: phoneForgot
                      }

                      await axios.post('http://' + ip + '/findEmailByPhone', data)
                        .then((response) => {
                          console.log('+++++')
                          setEmail(response.data.data);
                          sendOTP(response.data.data);
                          setShowOTPInput(true)
                          return response.data.data;
                        })
                        .catch((error) => {
                          console.log('Error: ', error);
                        }
                        )
                    }
                    //  setShowOTPInput(true)

                  }
                }}
                style={styles.sendCodeButton}
              >
                <Text
                  style={styles.titleButtonSendCode}
                >
                  Gửi mã xác nhận
                </Text>
              </TouchableOpacity>
              {renderCountdown(showCountdown)}
            </View>
          ) : (
            null
          )
        }



      </View>

      <Portal>
        <Modal visible={showModal} onDismiss={() => setShowModal(false)}>
          <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Thông báo</Text>
            <Text style={{ fontSize: 17, marginTop: 10, textAlign: 'center' }}>Mã OTP không chính xác</Text>
            <TouchableOpacity style={{ backgroundColor: '#3c3c3c', padding: 10, borderRadius: 10, marginTop: 20 }} onPress={() => setShowModal(false)}>
              <Text style={{ fontSize: 17, color: 'white', textAlign: 'center' }}>Đóng</Text>
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
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#E5E5E5',
    borderRadius: 10,
    paddingLeft: 10,
  },
  titleWrapper: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 20
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  sendCodeButton: {
    width: '90%',
    height: 50,
    backgroundColor: '#3c3c3c',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10
  },
  titleButtonSendCode: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
  },
  showOTPWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',

  },
  buttonResetPass: {
    width: '100%',
    height: 50,
    // backgroundColor : '#3c3c3c',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})