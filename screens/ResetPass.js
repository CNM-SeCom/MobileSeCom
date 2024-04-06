import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native'
import { TextInput } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useState, useRef, useEffect  } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import ip from '../data/ip';

const ResetPass = () => {
  const user = useSelector((state) => state.user.user);
  // const account = useSelector((state) => state.account.account);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('aaaaaaaaA1@');
  const [newPassword, setNewPassword] = useState('aaaaaaaaA2@');
  const [reNewPassword, setReNewPassword] = useState('aaaaaaaaA2@');
  const navigation = useNavigation();
  const data={
    phone: user.phone,
    oldPass: password,
    newPass: newPassword
  }

  const route = useRoute().params;
  const type = route.type;

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
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+])[A-Za-z\d!@#$%^&*()-+]{8,}$/;
  handleResetPass = async () => {
    // const { phone, newPass, oldPass } ;
     
    if(!password){
      alert('Vui lòng nhập mật khẩu cũ');
    }
    else if(password === '' || newPassword === '' || reNewPassword === '') {
      alert('Vui lòng nhập đầy đủ thông tin');
    }else if(!passwordRegex.test(newPassword)) {
      alert('Mật khẩu mới không đúng định dạng');
    }else if (newPassword !== reNewPassword) {
      alert('Mật khẩu mới không trùng khớp');
    } else {
      
      console.log(data.phone)
      await axios.post('http://' + ip + ':3000/changePassword',data).then((res) => {
      
      alert('Cập nhật mật khẩu thành công');
      navigation.navigate('Setting');
  
  }).catch((err) => {
    console.log(err);
    alert("Đổi mật khẩu thất bại");
  })
      
    }
  }
  
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
        type === 'changePass' ?
        <TextInput
          mode='outlined'
          label="Nhập mật khẩu cũ"
          style={styles.textInput}
          onChangeText={(text) => {setPassword(text)}}
          value={password}
        />
        : null
      }
        <TextInput
          mode="outlined"
          label="Mật khẩu mới"
          style={styles.textInput}
          onChangeText={(text) => {setNewPassword(text)}}
          value={newPassword}
        />
        <TextInput 
          mode="outlined"
          style={styles.textInput}
          label="Nhập lại mật khẩu mới"
          onChangeText={(text) => {setReNewPassword(text)}}
          value={reNewPassword}
        />
        <TouchableOpacity
          style={styles.buttonResetPass}
          onPress={() => { handleResetPass() }}
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