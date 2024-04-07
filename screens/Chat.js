import { StyleSheet, Text, View, FlatList,TouchableOpacity, TextInput , Dimensions} from 'react-native'
import React,{ useLayoutEffect, useState, useEffect }  from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import ConversationUnit from '../components/ConversationUnit';
import DataUser from '../data/dataUser';
import Avatar from '../components/Avatar';
import DataChat from '../data/dataChat';
import axios from 'axios';
import ip from '../data/ip';
import { useSelector,useDispatch } from 'react-redux';
import { setChatData } from '../redux/chatDataSlice';
import { setChatId } from '../redux/chatIdSlice';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const heigh = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Chat = () => {

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      getChatData();
      console.log('Chat Screen focused');
      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [])
  );

  const user = useSelector((state) => state.user.user);
  const mode = useSelector((state) => state.mode.mode);
  const token = useSelector((state) => state.token.token);
  // const chatId = useSelector((state) => state.chatId.chatId);
  const [chatId, setChatId] = useState('');
  const [messages, setMessagess] = useState([]);
  const navigation = useNavigation();
  
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const colors = useSelector((state) => {
    switch (mode) {
      case 'dark':
        return state.theme.darkColors;   
      default:
        return state.theme.lightColors;
    }
  });

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.accessToken}` // Thêm token vào tiêu đề Authorization
    }
  };
  //load hoi thoai
  const [messageData, setMessageData] = useState([]);

  const getChatData = () => {
    axios.post('http://'+ip+':3000/getChatByUserId',{
      idUser: user.idUser
  }, config)
    .then((response) => {
      setMessageData(response.data.data); 
    })
    .catch((error) => {
      console.log(error);
    });
  }
  // load tin nhan
  const loadMessageData = (id, navigation, name, idUser) => {
    axios.post('http://'+ip+':3000/getMessageByChatId',{
      chatId: id
    }).then((response) => {
      dispatch(setChatData(response.data.data));
      console.log(name)
      navigation.navigate('Conversation', {username: name, id : idUser, chatId: id});
    }).catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    getChatData();
    setLoading(false);
    // dispatch(setChatId(chatId))
  }, [chatId]);

  useEffect(() => {
    if (user && messageData.length > 0) {
      const otherParticipant = messageData[0].participants.find(element => element.idUser !== user.idUser);
      if (otherParticipant) {
        setChatId(messageData[0].id);
      }
    }
  }, [user, messageData]);
  
  return (
    <View style={[
      {backgroundColor : colors.background},
      styles.container]}>
      <View style={{
          width: '100%',
          height: 50,
          justifyContent: 'center',
          
      }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="white" style={{
              position: 'absolute',
              top: 15,
              left: 25,
              zIndex: 1,
          
          }} />
          <TextInput
            style={styles.inputSearch}
            placeholder="Tìm kiếm"
            paddingLeft={40}
            opacity={0.5}
            onFocus={() => {
                // setOpacity(1);
            }}
          />
      </View>
      <View style={[
        {backgroundColor : colors.background},
        styles.users]}>
          {
            messageData ?
            (
              <FlatList
              data={messageData}
              showsHorizontalScrollIndicator = {false}
              renderItem={({item}) =>{ 
                var otherParticipant;
                  // Lặp qua mảng participants để tìm người tham gia khác người dùng hiện tại
                  // dispatch(setChatId(item.id));
                  // setChatId(item.id)
                  if (user) {
                     otherParticipant = item.participants.find(element => element.idUser !== user.idUser);
                     return (
                      <Avatar
                        image={otherParticipant.avatar}
                      />
                  )
                }}
              }
              keyExtractor={messageData => messageData.id}
              horizontal={true}
            />
            ) :(
              null
            )
          }
      </View>
      <View style={{
          width: '100%',
          height: heigh * 0.6,
          alignItems: 'center',
      }}>
        {
         messageData ? (
          <FlatList
          data={messageData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            var otherParticipant;
            // Lặp qua mảng participants để tìm người tham gia khác người dùng hiện tại
            // dispatch(setChatId(item.id));
            // setChatId(item.id)
            if (user) {
               otherParticipant = item.participants.find(element => element.idUser !== user.idUser);
             
              if (otherParticipant) {
                return (
                  <ConversationUnit
                    image={otherParticipant.avatar}
                    name={otherParticipant.name}
                    newMess={item.lastMessage}
                    onPress={() => loadMessageData(item.id, navigation,otherParticipant.name,otherParticipant.idUser)}
                  />
                );
              } else {
                return null;
              }
            } else {
              return null;
            }
          }}
        />
         ) : (
          null
         )
        }

      </View>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
      },
    customHeader: {
        height: 50, 
        backgroundColor: '#CC8EE6',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      headerText: {
        color: '#fff', 
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
      },
      iconHeader: {
        color: '#fff', 
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 20,
        alignSelf: 'center',
      },
      iconUser :{
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
        marginRight: 10,
      },
      users : {
          width: '100%',
          height: 80,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          padding: 5,
      },
      inputSearch :{
        width: '97%',
        height: 40,
        backgroundColor: '#808080',
        padding: 5,
        alignSelf: 'center',
        borderRadius: 30,
      },
})