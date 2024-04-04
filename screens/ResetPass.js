import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import React, { useEffect, useState} from 'react'
import { TextInput } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios';
import ip from '../data/ip'

const ResetPass = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reNewPassword, setReNewPassword] = useState('');

  const navigation = useNavigation();

  const route = useRoute().params;

  console.log('routee', route);

  const handleCompare = () => {
    if (newPassword !== reNewPassword) {
      alert('Mật khẩu không khớp');
    } else {
      handleResetPass();
      navigation.navigate('Login');
      alert('Mật khẩu đã được thay đổi');
    }
  };

  const data = {
    phone : route.phone,
    newPass: newPassword,
  }
  console.log('data', data);

  const handleResetPass = () => {
    axios.post('http://' + ip + ':3000/forgotPassword', data)
    .then(res => {
      console.log(res.data);
    })
    .catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Thay đổi mật khẩu',
      headerTitleAlign: 'flex-start',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
      },
      headerStyle: {
        backgroundColor: '#C3F8FF',
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
              <FontAwesomeIcon icon={faArrowAltCircleLeft} size={25} color={'black'} />
            </TouchableOpacity>
          </View>
        )
      },
    });
  }, [navigation])

  return (
    <View
      style={styles.container}
    >
      <Text
        style={styles.title}
      >
        Cập nhật lại mật khẩu
      </Text>
     
      <View
        style={styles.wrapperInputResetPass}
      >
        {
        route.type === 'changePass' ?
        <TextInput
          mode='outlined'
          label="Nhập mật khẩu cũ"
          style={styles.textInput}
        />
        : null
      }
        <TextInput
          mode="outlined"
          label="Mật khẩu mới"
          onChangeText={(text) => setNewPassword(text)}
          style={styles.textInput}
        />
        <TextInput 
          mode="outlined"
          style={styles.textInput}
          onChangeText={(text) => setReNewPassword(text)}
          label="Nhập lại mật khẩu mới"
        />
        <TouchableOpacity
          onPress={()=>{
            handleCompare();
          }}
          style={styles.buttonResetPass}
        >
          <Text
            style={styles.textButton}
          >
            Lưu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ResetPass

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C3F8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapperInputResetPass :{
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonResetPass: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CB9E7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  } ,
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: 'black',
    marginBottom: 20,
  },
})