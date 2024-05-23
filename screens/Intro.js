import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import Video from 'react-native-video'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios'
import { setUser } from '../redux/userSlice';
import { setToken } from '../redux/tokenSlice';
import ip from '../data/ip';

export default function Intro() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.token);

  const navigation = useNavigation();

  const handlePress = () => {
    {
      // navigation.navigate('Login');
      checkLoginState();
    };
  };

  const saveLoginState = async (token, id) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('idUser', id);
    } catch (error) {
      console.error('Lỗi khi lưu trạng thái đăng nhập:', error);
    }
  };

  const checkLoginState = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const idUser = await AsyncStorage.getItem('idUser');
   
      if (userToken) {
        // Thực hiện các hành động liên quan đến đăng nhập
        await axios.post('http://' + ip + ':3000/checkLoginWithToken', {refreshToken: userToken, idUser: idUser})
        .then(res => {
          dispatch(setUser(res.data.data));
        })
        
        .catch(err => {
          console.log(err);
        });
        const data = {
          refreshToken: userToken,
          idUser: idUser
        }
       await axios.post('http://' + ip + ':3000/updateAccessToken', data)
          .then((response) => {
            dispatch(setToken(response.data));

            saveLoginState(response.data.refreshToken, idUser);
            navigation.navigate('TabHome');
          })
          .catch((error) => {
            console.log('lỗi update token');
            console.log('Error: ', error);
          })
       

       
       
      } else {
        console.log('Người dùng chưa đăng nhập.');
        // Thực hiện các hành động liên quan đến chưa đăng nhập
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Video
          source={require('../assets/intro.mp4')}
          style={styles.background}
          controls={false}
          resizeMode='cover'

        />
        <TouchableOpacity
          onPress={handlePress}
          style={styles.button}>
          <Text style={styles.titleButton}>Getting Start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',

  },
  background: {
    width: '100%',
    height: '100%',
  },
  wrapper: {
    width: '100%',
    height: '100%',
    // paddingTop : Platform.OS === 'android' ? 35 : 0,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleButton: {
    fontSize: 20,
    color: '#000000',
    fontWeight: 'bold',
  }
})