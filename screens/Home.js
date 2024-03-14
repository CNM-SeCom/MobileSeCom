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
import { setChatData } from '../redux/chatDataSlice'



const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Home = ({ navigation }) => {

  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.mode.mode);
  const colors = useSelector((state) => {
    switch (mode) {
      case 'dark':
        return state.theme.darkColors;
      case 'light':
        return state.theme.lightColors;
      default:
        return state.theme.defaultColors;
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
     
    });
  }, [navigation]);

useEffect(() => {
  console.log("ahihi")
},[messages])
  return (
    <View style={[
      {backgroundColor : colors.background},
      styles.container]}>
      <View style={styles.scrollContainer}>
        {messages.map((item, index)= () => {
          return(
          <View>
            <Text>{item._id}</Text>
          </View>
          )
          
        })}
            {/* <ScrollView
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
            </ScrollView> */}
            <View>
      
      <WS
        ref={ref => { this.ws = ref }}
        url="ws://192.168.130.78:3001/?idUser=1231"
        onOpen={() => {
          console.log('Open!');
          this.ws.send('Hello');
        }}
        onMessage={(msg) => {
              setMessages(JSON.parse(msg.data));
        }}
        onError={console.log}
        onClose={console.log}
      />
      
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