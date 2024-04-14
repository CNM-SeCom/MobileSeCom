import { StyleSheet, Text, View, Dimensions, Image, ScrollView } from 'react-native'
import React,{ useLayoutEffect, useEffect, useState }  from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Post from '../components/Post'
import listPost from '../data/ListPost'
import listUser from '../data/List_user'
import WS from 'react-native-websocket'
import axios from 'axios';
import ChatData from '../data/dataChat';
import { useSelector, useDispatch } from 'react-redux';
import { setChatData, addChatData } from '../redux/chatDataSlice'
import { setMessages, addMessage } from '../redux/messageSlice'
import { setTyping } from '../redux/checkTypingSlice'
import { setUser } from '../redux/userSlice'
import ip from '../data/ip'
import Toast from 'react-native-toast-message';
import { idText } from 'typescript'



const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Home = ({ navigation }) => {
  const user = useSelector((state) => state.user.user);
  const currentId = useSelector((state) => state.currentId.currentId);
  const dispatch = useDispatch();
  const chatData = useSelector((state) => state.chatData.chatData); 
  const token = useSelector((state) => state.token.token); 


  const mode = useSelector((state) => state.mode.mode);
  const colors = useSelector((state) => {
    switch (mode) {
      case 'dark':
        return state.theme.darkColors;   
      default:
        return state.theme.lightColors;
    }
  });


  
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
     
    });
  }, [navigation]);

  useEffect(() => {
  }, [chatData]);
  //hàm load lại màn hình và lấy dữ liệu mới sau khi thêm chatData

  
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      }
    };
  
    //logout
    const handleLogout = () => {
      if (!user) {
        navigation.navigate('Login');
      } else {
        axios.post('http://'+ip+':3000/logout', { idUser: user.idUser }, config)
          .then((response) => {
       
            dispatch(setUser({}));
            navigation.navigate('Login');
          })
          .catch((error) => {
        
          });
      }
    };
    const showToast = (name, text) => {
      Toast.show({
        type: 'info',
        text1: name,
        text2: text
      });
    }
    

  return (

    <View style={[
      {backgroundColor : colors.background},
      styles.container]}>
      <View style={styles.scrollContainer}>
            <ScrollView
              lazyLoad={true}
              scrollEventThrottle={90}
              contentContainerStyle={styles.wrapperPost}
            >

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
            </ScrollView>
            <View>
      
      {
        user ? 
        <WS
        ref={ref => { this.ws = ref }}
        url={`ws://${ip}:3001/?idUser=`+user.idUser}
        
        onOpen={() => {
          console.log('Open!');
        }}
        
        onMessage={(msg) => {
          let data = JSON.parse(msg.data);
          let add;
          //ảnh sẽ gắn mặc định
          // data.user.avatar = require('../assets/logo1.png');
        if(data.type === 'ADD_FRIEND'){
          showToast(data.user.name, data.text);
        }
        else if(data.type === 'ACCEPT_FRIEND'){
          console.log(data.data);
          showToast(data.user.name, data.text);
        }
        else if(data.type === 'TYPING'){
          if(currentId &&data.chatId === currentId){
            dispatch(setTyping(data.typing));
        }
      }
        else if(data.type === 'RELOAD_MESSAGE'){
          if(data.chatId === currentId){
               axios.post('http://'+ip+':3000/getMessageByChatId',{
                chatId: currentId    
              }).then((response) => {
                dispatch(setChatData(response.data.data));
              }).catch((error) => {
                console.log(error);
              }
              );           
          }
          
        }
        else if(data.type === 'RELOAD_CONVERSATION'){
          console.log('RELOAD_CONVERSATION');
        }
        else{
           if( data.chatId === currentId){
            add = dispatch(addChatData(data));
           }
          // console.log(data)
          // showToast(data.user.name, data.text);
          if (add) {
            
          }else {
            console.log('Not Add');
          }
        }
          
      
          
        }}
        onError={console.log}
        onClose={() => {
        }}
      /> : null
      }
      
      </View>
      </View>
    
      </View>
  )
}

export default Home

const styles = StyleSheet.create({
   container: {
       width: width,
       height: height,
       alignItems: 'center',

   },
  
      nav : {
        width: width ,
        height: 50,
        backgroundColor: '#3c3c3c',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
      },
      scrollContainer: {
        width: '100%',
        height: height - 100,
        backgroundColor: '#C4B8E6',
        alignItems: 'center',
      },
      wrapperPost: {
        width: width,
        height: 'fit-content',
        alignItems: 'center',
        backgroundColor: '#18191a',
        paddingBottom: 40,

      },
})