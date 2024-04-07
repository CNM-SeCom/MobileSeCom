import { StyleSheet, Text, View, Image, Dimensions,ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import Post from '../components/Post'
import listPost from '../data/ListPost'
import listUser from '../data/dataUser'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';

import {useNavigation} from '@react-navigation/native';

import { useSelector } from 'react-redux';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Bio = () => {

    const mode = useSelector((state) => state.mode.mode);
    const user = useSelector((state) => state.user.user);
    const colors = useSelector((state) => {
      switch (mode) {
        case 'dark':
          return state.theme.darkColors;   
        default:
          return state.theme.lightColors;
      }
    });
    useEffect(() => {
      console.log('user đã thay đổi');
      // Thực hiện các hành động bạn muốn khi màn hình được focus lại ở đây
      //load lại user
    }, [user]);

const navigation = useNavigation();

  return (
    <ScrollView 
    lazyLoad={true}
    scrollEventThrottle={90}
    contentContainerStyle={styles.wrapperPost}
    style={styles.container}>
       {
        user ?
        <View style={[{backgroundColor : colors.background },styles.scrollContainer]}>
       <View style={{
        width: width,
      }}>
      <View style={[
        styles.bioContainer]}>
        <View style={styles.coverImage}>
        {
            user == null ?
            null
            :
            <Image
            style={{width: '100%', height: '100%'}}
            source={{uri: user.coverImage}}
            />
          }
        </View>
        <View style={styles.avatar}>
          {
            user == null ?
            null
            :
            <Image
            style={{width: '100%', height: '100%'}}
            source={{uri: user.avatar}}
            />
          }
        </View>
        <View style={[
          styles.profile]}>
            <View style={{
              flexDirection: 'row',
              alignSelf: 'center',
              width: '50%',
              left: 90,
              bottom: 50,
            }}>
              <Text style={[
              {color: colors.text},
              styles.name]}>{user.name}</Text>
            </View>
          <View
            style={{
              width: '100%',
              height: 'fit-content',
              padding: 10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: colors.text,
            }}>
          {
            user.gender == 0 ?
            <Text style={[
              {color: colors.text},
              styles.profileText]}>Giới tính : Nam</Text>
            :
            <Text style={[
              {color: colors.text},
              styles.profileText]}>Giới tính : Nữ</Text>

          }
          <Text style={[
            {color: colors.text},
            styles.profileText]}>Phone : {user.phone}</Text>
          <Text style={[
            {color: colors.text},
            styles.profileText]}>Email : {user.email}</Text>
          <Text style={[
            {color: colors.text},
            styles.profileText]}>Địa chỉ : {user.address}</Text>
          <Text style={[
            {color: colors.text},
            styles.profileText]}>Ngày sinh : {user.dob}</Text>
          </View>
          <TouchableOpacity 
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.editProfileButton}>
            <Text style={{textAlign: 'center', marginTop: 5,fontSize : 15}}>Chỉnh sửa thông tin cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity 
          onPress={() => navigation.navigate('FriendList')}
          style={styles.editProfileButton}>
            <Text style={{textAlign: 'center', marginTop: 5,fontSize : 15}}>Danh sách bạn bè</Text>
          </TouchableOpacity>
        </View>
      </View>
      </View>
            <View style={{
              width: width,
              height: 'fit-content',
              alignItems: 'center',
            }}>

              {
                listPost.map((item, index) => (
                  <Post
                    userName={listUser[item.idUser - 1].name}
                    key={index}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    content={item.content} 
                    />
                ))
              }
            </View>
      </View>:
      null
       }
    </ScrollView>
  )
}

export default Bio

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: height,
  },
  bioContainer: {
    width: '98%',
    alignSelf: 'center',
    paddingTop: 10,
  },
  coverImage: {
    width: '98%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'gray',
  },
  avatar: {
    overflow: 'hidden',
    width: 150,
    height: 150,
    borderRadius: 75,
    position: 'absolute',
    top: 130,
    left: 20,
    borderWidth: 5,
    borderColor: '#fff',
    zIndex: 2,
    
  },
  profile: {
    width: '98%',
    height: 'fit-content',
    paddingTop: 60,
    paddingBottom: 20,
    alignSelf: 'center',
  },
  name : {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',

  },
  profileText: {
    fontSize: 16,
    marginLeft: 10,
  },
  scrollContainer: {
    width: width,
    alignItems: 'center',
    paddingBottom: 10,
  },
  editProfileButton :{
    marginTop: 20,
    width: '80%',
    height: 30,
    backgroundColor: '#8ac8d8',
    borderRadius: 5,
    alignSelf: 'center',
  }
})