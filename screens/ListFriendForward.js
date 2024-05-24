import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert } from 'react-native'
import React, {useState,useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import ip from '../data/ip';
import { useSelector,useDispatch } from 'react-redux';
import { setChatData } from '../redux/chatDataSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPen, faMagnifyingGlass, faUser, faShare } from '@fortawesome/free-solid-svg-icons';
import { useRoute } from '@react-navigation/native';
import { addChatData } from '../redux/chatDataSlice';
import Load from '../components/Load';


const ListFriendForward = () => {

const route = useRoute().params.data;
console.log('route :', route);

const user = useSelector((state) => state.user.user);
const mode = useSelector((state) => state.mode.mode);
const token = useSelector((state) => state.token.token);

const [show, setShow] = useState(false);
const [messageData, setMessageData] = useState([]);
const [chatId, setChatId] = useState('');

const navigation = useNavigation();
const dispatch = useDispatch();
const colors = useSelector((state) => {
  switch (mode) {
    case 'dark':
      return state.theme.darkColors;   
    default:
      return state.theme.lightColors;
  }
});


const getChatData = async() => {
  await axios.post('http://'+ip+'/getChatByUserId',{
    idUser: user.idUser
}, config)
  .then((response) => {
    console.log(response.data.data);
    setMessageData(response.data.data); 
    setShow(false);
  })
  .catch((error) => {
    console.log(error);
  });
}

const handleForward = async(item) => {

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    body :{
      message: {
        chatId: item.id,
        text: route.text,
        type: 'text',
        user: {
          idUser: user.idUser,
          avatar: user.avatar,
          name: user.name,
        },
        receiverId: route.receiverId,
      }
    }
  }

  axios.post('https://' + ip + '/ws/send-message-to-user', config.body)
    .then((response) => {
      if(chatData.id == config.body.message.chatId){
        dispatch(addChatData(config.body.message));
        alert('Thông báo ', 'Chuyển tiếp thành công')
        setShow(false);
        navigation.goBack();
      }
    }
    )
    .catch((error) => {
      console.log(error);
      setShow(false);
    });

    navigation.goBack();
}

const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.accessToken}` // Thêm token vào tiêu đề Authorization
    }
  };

useFocusEffect(
  React.useCallback(() => {
    setShow(true);
    getChatData();
    return () => {
      console.log('Screen ListFriendForward was focused');
    };
  }, [])
);


useEffect(() => {
    if (user && messageData.length > 0) {
      const otherParticipant = messageData[0].participants.find(element => element.idUser !== user.idUser);
      if (otherParticipant) {
        setChatId(messageData[0].id);
      }
    }
  }, [user, messageData]);

  const renderItemFriend = ({ item }) => {
    // Trích xuất thông tin về người tham gia khác ngoài user
    const otherParticipant = item.participants.find(element => element.idUser !== user.idUser);
    if (otherParticipant && route.chatId != item.id) {
      return (
        <View style={styles.itemContainer}>
            <Image
                source={{uri: otherParticipant.avatar}}
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 10,
                    
                }}
            />
            <Text
                style={{
                color: colors.text,
                fontSize: 16,
                color: 'black',
                marginLeft: 10,
                fontWeight : 'bold'
                }}
            >{otherParticipant.name}</Text>
            <TouchableOpacity
                style={styles.shareIcon}
                onPress={() => {
                  handleForward(item);
                  console.log('chatId :', item.id);
                  setShow(true);
                }}
            >
                <FontAwesomeIcon icon={faShare} size={25} color="white" />
            </TouchableOpacity>
        </View>
      );
    }
    return null;
  };


  return (
    <View
        style={[styles.container,{
            backgroundColor: colors.background,
        }]}
    >
        <FlatList
            style={styles.wrapper}
            data={messageData}
            renderItem={renderItemFriend}
            keyExtractor={item => item.id}
        />
        <Load show={show}/>
    </View>
  )
}

export default ListFriendForward

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
    },
    itemContainer :{
        flexDirection : 'row',
        width : '90%',
        justifyContent : 'flex-start',
        alignItems : 'center',
        borderBottomColor : 'black',
        color : 'black',
        backgroundColor : '#C3F8FF',
        padding : 10,
        alignSelf : 'center',
        marginVertical : 10,
        borderRadius : 10,
        elevation : 15,
        columnGap : 10
    },
    wrapper :{
        width : '100%',
        height : '100%',
        color : 'black',
        paddingBottom : 20,
    },
    shareIcon :{
        position : 'absolute',
        right : 15
    }
})