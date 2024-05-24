import { StyleSheet, Text, View, Image, Dimensions,ScrollView, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import Post from '../components/Post'
import listPost from '../data/ListPost'
import listUser from '../data/dataUser'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { useFocusEffect } from '@react-navigation/native';
import { useEffect } from 'react';
import axios from 'axios';
import ipp from '../data/ipPost'
import Loading from '../components/Load';
import { Provider} from 'react-native-paper';

import {useNavigation} from '@react-navigation/native';

import { useSelector } from 'react-redux';
import Load from '../components/Load'

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Bio = () => {

    const [loading, setLoading] = useState(false);

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
   

    
    let [listPostFromServer, setListPostFromServer] = useState([]);
    //get posts from server
    const getPosts = async () => {
      try {
        await axios.get('http://' + ipp + '/post/findAll')
          .then(res => {
            setListPostFromServer(res.data);
            setLoading(false);
          })
      } catch (error) {
        console.log(error);
      }
    }

    const deletePost=(id) => {
      console.log('delete', id);
      console.log('id', id);
      setListPostFromServer(listPostFromServer.filter((item) => item._id !== id));

    }
    useFocusEffect(
      React.useCallback(() => {
          // setLoading(true);
          setLoading(true);
          console.log('loading', loading);
          getPosts();
          console.log('Bio Screen focused');
      }, [])
  );
  useEffect(() => {
    // Thực hiện các hành động bạn muốn khi màn hình được focus lại ở đây
    //load lại user
  }, [user,loading]);
    useEffect(() => {
    }, [listPostFromServer]);

const navigation = useNavigation();

  return (
    <Provider>
      <ScrollView 
    lazyLoad={true}
    scrollEventThrottle={90}
    contentContainerStyle={styles.wrapperPost}
    style={[styles.container,{
      backgroundColor: colors.background,
    }]}>
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
            styles.profileText]}>Ngày sinh : {
              new Date(user.dob).getDate() + '/' + (new Date(user.dob).getMonth() + 1) + '/' + new Date(user.dob).getFullYear()
            }</Text>
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
              backgroundColor: colors.background,
            }}>

          {
            listPostFromServer.map((item, index) => (
              item.idUser == user.idUser ?
              <Post
                userName={item.userCreated}
                // userName={"Triet"}
                key={index}
                title={item.title}
                description={''}
                image={
                  item?.content?.images?.length < 1 ? source =  require('../assets/logo1.png')  : { uri : item?.content?.images }
                }
                content={item.content.text}
                likes={item.likes}
                comments={item.comments}
                idUser={user?.idUser}
                idPost={item?._id}
                idUserCreated={item?.idUser.toString()}
                deletePost={()=>deletePost(item._id)}
                getPosts={getPosts}
              /> : null
            ))
          }
            </View>
      </View>:
      null
       }
       <Load show={loading}/>
    </ScrollView>
    </Provider>
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