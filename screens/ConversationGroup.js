import React, { useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PermissionsAndroid, Image, Animated, ActivityIndicator, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Avatar } from 'react-native-elements';
import { faPhone, faCamera, faInfo, faCircleInfo, faArrowLeft, faPaperclip, faMicrophone, faVideo, faXmark } from '@fortawesome/free-solid-svg-icons';
import ChatDataHash from '../data/dataChat';
import { IconButton } from 'react-native-paper';
import { Icon } from 'react-native-elements'
import WS from 'react-native-websocket'
import axios, { formToJSON } from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setChatData, addChatData , removeLastMessage} from '../redux/chatDataSlice'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons';
import chatId from '../redux/chatIdSlice';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Video from 'react-native-video'
import ip from '../data/ip'
import RNFetchBlob from 'rn-fetch-blob';
import { Provider, Portal, Modal, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const ConversationGroup = () => {

  const navigation = useNavigation();

  const flatListRef = useRef();
  const [menuVisible, setMenuVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUri, setVideoUri] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [loadVideo, setLoadVideo] = useState(true);
  const [messageId, setMessageId] = useState();
  const [isMyMessage, setIsMyMessage] = useState(false);

  const images = [{
    url: imageUri,
  }]
  const handleShowImage = (image) => {
    setShowImage(true);
    setImageUri(image);
  }


  const handleShowVideo = (video) => {
    setLoadVideo(true);
    setShowVideo(true);
    setVideoUri(video);

  }

  const handleLongPress = (id) => {
    setMessageId(id);
    // Hiển thị menu lựa chọn
    setMenuVisible(true);
    // Hoặc bạn có thể sử dụng Alert để hiển thị các lựa chọn

  };


  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    setMessages([chatData]);
    scrollToBottom();
  }, [chatData, text, image, video, docment]);



  let chatData = useSelector((state) => state.chatData.chatData);
  const token = useSelector((state) => state.token.token);
  const user = useSelector((state) => state.user.user);
  const [imageMessage, setImageMessage] = useState([]);
  const [messages, setMessages] = useState(chatData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const [text, setText] = useState(''); // Khai báo biến text để lưu nội dung tin nhắn
  const [image, setImage] = useState(null); // Khai báo biến image để lưu ảnh đính kèm
  const [video, setVideo] = useState(null); // Khai báo biến video để lưu video đính kèm
  const [docment, setDocment] = useState(null); 
  let [forwardMessage, setForwardMessage] = useState(null);

//cuộc hội thoại giữa 6 người
const data = [
  {
    id: 1,
    idUser: 'user1',
    text: 'Chào bạn!',
    name : 'Nguyễn Văn A',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 2,
    idUser: 'user2',
    text: 'Xin chào!',
    name : 'Nguyễn Văn B',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 3,
    idUser: 'user3',
    text: 'Có gì mới không?',
    name : 'Nguyễn Văn c',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 4,
    idUser: 'user4',
    text: 'Không có gì đặc biệt',
    name : 'Nguyễn Văn D',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 5,
    idUser: 'user5',
    text: 'Bạn đã ăn tối chưa?',
    name : 'Con cak',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 6,
    idUser: 'user6',
    text: 'Rồi, bạn ăn tối chưa?',
    name : 'mmb',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  }, {
    id: 1,
    idUser: 'user1',
    text: 'Chào bạn!',
    name : 'Nguyễn Văn A',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 2,
    idUser: 'user2',
    text: 'Xin chào!',
    name : 'Nguyễn Văn B',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 3,
    idUser: 'user3',
    text: 'Có gì mới không?',
    name : 'Nguyễn Văn c',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 4,
    idUser: 'user4',
    text: 'Không có gì đặc biệt',
    name : 'Nguyễn Văn D',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 5,
    idUser: 'user5',
    text: 'Bạn đã ăn tối chưa?',
    name : 'Con cak',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 1,
    idUser: 'user1',
    text: 'Chào bạn!',
    name : 'Nguyễn Văn A',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 2,
    idUser: 'user2',
    text: 'Xin chào!',
    name : 'Nguyễn Văn B',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 3,
    idUser: 'user3',
    text: 'Có gì mới không?',
    name : 'Nguyễn Văn c',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 4,
    idUser: 'user4',
    text: 'Không có gì đặc biệt',
    name : 'Nguyễn Văn D',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
  {
    id: 5,
    idUser: 'user5',
    text: 'Bạn đã ăn tối chưa?',
    name : 'Con cak',
    avatar: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg',
    type : 'text'
  },
];

const renderTyping = () => {
  if (text) {
    return (
      <View
        style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', width: '100%' }}
      >
        <TextInput
          style={[{ width: '95%' }, styles.inputMessage]}
          placeholder='Nhập tin
          nhắn...'
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          style={styles.sendTextButton}
          // onPress={handlesendText}
          >
          <Icon name='send' size={25} color='white' />
        </TouchableOpacity>
      </View>
    )
  }
  else {
    return (
      <View
        style={styles.sendMediaBar}
      >
        <TextInput
          style={[{ width: '75%' }, styles.inputMessage]}
          placeholder='Nhập tin
            nhắn...'
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity
          style={styles.sendImageButton}
          onPress={handlePickPicture}>
          <FontAwesomeIcon icon={faImage} size={20} color="#009688" style={styles.iconHeader} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendImageButton}
          onPress={handlePickPicture}>
          <FontAwesomeIcon icon={faPaperclip} size={20} color="#009688" style={styles.iconHeader} />
        </TouchableOpacity>
      </View>
    )
  }
}
handlePickPicture = () => {
  selectImage()
}
const selectImage = async () => {
  const result = await launchImageLibrary({
    mediaType: 'mixed',
    quality: 1,
  });

  if (result.didCancel) {
    console.log('User cancelled image picker');
  } else if (result.error) {
    console.log('ImagePicker Error: ', result.error);
  } else {
    imageMessage.push(result.assets[0].uri);
    setImageMessage([...imageMessage]);

  }
};
handlePickVideo = () => {
  openGalleryVideo();
}
const renderMedia = () => {
  if (imageMessage.length > 0) {
    return (
      <View style={styles.mediaStackView}>
        <FlatList

          lazyLoading={true}
          data={imageMessage}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={{ width: 50, height: 50, marginLeft: 5 }} />
          )}
          keyExtractor={(item) => item}
          horizontal={true}
        />
        <TouchableOpacity
          onPress={() => setImageMessage([])}
        >
          <FontAwesomeIcon icon={faXmark} size={25} color='#009688' />
        </TouchableOpacity>
        <TouchableOpacity
          // onPress={handleSendMedia}
          style={{ padding: 10 }}
        >
          <Icon name='send' size={25} color='#009688' />
        </TouchableOpacity>

      </View>
    )
  }
}

useLayoutEffect(() => {
  navigation.setOptions({
    headerShown: true,
    header: () => (
      <View style={styles.customHeader}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 40,
        }}>
          <Avatar rounded source={{
            uri: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg'
          }} />
          <Text style={styles.headerText}>GHGHGH</Text>
        </View>
        <View style={{
          position: 'absolute',
          marginLeft: 10,
        }}>
          <TouchableOpacity
            onPress={() => {
              console.log('back', loading);
              if (!loading) {
                navigation.navigate('Chat')
              }
              else {
                setVisible(true);
              }
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" style={styles.iconHeader} />
          </TouchableOpacity>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginLeft: 10,
        }}>
          <TouchableOpacity>
            <FontAwesomeIcon icon={faPhone} size={20} color="#fff" style={styles.iconHeader} />
          </TouchableOpacity>
          <FontAwesomeIcon icon={faCamera} size={20} color="#fff" style={styles.iconHeader} />
          <FontAwesomeIcon icon={faCircleInfo} size={20} color="#fff" style={styles.iconHeader} />
        </View>
      </View>
    ),
  });
  scrollToBottom()
}, [navigation, loading]);

renderMessage = (item) => {
  if (item.type === 'text') {
    return (
      <TouchableOpacity
        onLongPress={()=>{
          if(item.idUser === 'user3'){
            setIsMyMessage(true);
          }
          else{
            setIsMyMessage(false);
          }
          console.log(isMyMessage);
          handleLongPress(item.id)
          }
        }
      >
        {
          //nếu không thuộc từ a - z thì không có back grounf
          item.text.match(/^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;'"|<,>.?\/\\\- \p{L}]+$/u ) ? (
            <View style={{ borderRadius: 10, padding: 10 }}>
              <Text style={{ color: 'black', fontSize: 16 }}>{item.text}</Text>
            </View>
          ) : (
            <View style={{ backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ color: 'black', fontSize: 16 }}>{item.text}</Text>
            </View>
          )
        }
      </TouchableOpacity>
    );
  } else if (item.type === 'image') {
    return (
      <TouchableOpacity
        onLongPress={()=>{
          if(item.idUser === 'user3'){
            setIsMyMessage(true);
          }
          else{
            setIsMyMessage(false);
          }
          console.log(isMyMessage);
          handleLongPress(item.image)
        }    
        }
        onPress={()=>{
          handleShowImage(item.image)
        }}
      >
        <Image source={{ uri:item.image }} style={{ width: 200, height: 200, borderRadius: 10 }} />
      </TouchableOpacity>
    );
  } else if (item.type === 'video') {

    return (
      <TouchableOpacity
        onLongPress={()=>{
          if(item.idUser === 'user3'){
            setIsMyMessage(true);
          }
          else{
            setIsMyMessage(false);
          }
          console.log(isMyMessage);
          handleLongPress(item._id)
         }}
        onPress={() => handleShowVideo(item.video)}
      >
        {/* <Text style={{ color: 'green', margin: 10, fontWeight: 'bold', fontSize: 15 }}>{item.user.name} đã gửi 1 video, bấm để xem</Text> */}
        {loading && typeof item.video === 'string' && !item.video.includes('cloudinary') ? <View style={{ flexDirection: 'row' }}>
          <Text style={{ color: 'black', margin: 10, fontWeight: 'bold', fontSize: 15 }}>{item.user.name} đang gửi 1 video</Text>
          <ActivityIndicator size="large" color="white" animating={loading} />
        </View> : <Text style={{ color: 'black', margin: 10, fontWeight: 'bold', fontSize: 15, textDecorationLine: 'underline' }}>{item.user.name} đã gửi 1 video, bấm để xem</Text>
        }
        {/* <Video
        source={{ uri: item.video }}
        style={{ width: 300, height: 170 }}
        resizeMode="cover"
        controls={true}
      /> */}
      </TouchableOpacity>
    );
  } else {
    // Return null or handle other cases
    return null;
  }
}
imageMessage.forEach(element => {
  //nếu đuôi là jpg thì gửi ảnh
  if (element.includes('.jpg' || '.png')) {
    console.log('image');
  }
  else {
    console.log('video');
  }
});
useEffect(() => {
}, [imageMessage]);

  return (
    <View
      style={styles.container}
    >
     <FlatList
          style={{ width: '100%' }}
          data={data}
          ref={flatListRef}
          keyExtractor={(item, index) => index.toString()}
          onContentSizeChange={() => scrollToBottom()}
          onLayout={() => scrollToBottom()}
          renderItem={({ item }) => (

            //nếu id người gửi khác với id nguôi dùng thì hiển thị tin nhắn bên trái
            item.idUser !== 'user3' ? (
              <View style={[{ justifyContent: 'flex-start' }, styles.bubble]}>
                <Avatar rounded source={{ uri: item.avatar }} />
                {/* <Avatar rounded source={{uri : item.user.avatar}} /> */}
                <View style={styles.bubbleLeft}>
                  {
                    renderMessage(item)
                  }
                </View>
              </View>
            ) : (
              <View style={[{ justifyContent: 'flex-end' }, styles.bubble]}>
                <View style={styles.bubbleRight}>
                  {
                    renderMessage(item)
                  }
                </View>
                <Avatar rounded source={{ uri: item.avatar }} />

                {/* <Avatar rounded source={{ uri: user.avatar }} /> */}
              </View>
            )
          )}

        />
         <Animated.View style={styles.sendBar}>
          {
            imageMessage.length > 0 ? (
              renderMedia()
            )
              : (
                renderTyping()
              )
          }
        </Animated.View>
    </View>
  )
}

export default ConversationGroup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  content: {
    padding: 10,
    maxWidth: 250,
  },
  text: {
    fontSize: 16,
    padding: 10,
  },
  customHeader: {
    height: 50,
    backgroundColor: '#009688',
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
  },
  bubble: {
    maxWidth: '95%',
    flexDirection: 'row',
    marginVertical: 10,
    marginLeft: 10,
    color : 'black'
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    color : 'black'

  },
  bubbleLeft: {
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginLeft: 10,
    color : 'black'

  },
  bubbleRight: {
    backgroundColor: '#009688',
    borderRadius: 10,
    marginRight: 10,
    alignSelf: 'center',
  },
  sendBar: {
    width: '100%',
    // flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputMessage: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
    margin: 10,
    color: 'black',
  },
  sendTextButton: {
    color: '#fff',
    fontSize: 16,
    // marginLeft: 2,
    backgroundColor: '#009688',
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: 30,
    borderRadius: 20,
    right: 70,
  },
  sendImageButton: {
    color: '#009688',
    fontSize: 16,
    marginLeft: 2,
  },
  sendVideoButton: {
    color: '#009688',
    fontSize: 16,
    marginLeft: 2,
  },
  sendDocmentButton: {
    color: '#009688',
    fontSize: 16,
    marginLeft: 2,
  },
  sendMediaBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  mediaStackView: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    paddingVertical: 5,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageOption: {
    fontSize: 15,
    fontWeight: 'bold',
    margin: 10,
    color: 'black',
  },
  buttonMessageOption: {
    borderBottomWidth: 1,
    borderColor: 'black',
  },
  buttonMessageOptionDelete: {
    borderBottomWidth: 1,
    borderColor: 'black',
    borderTopWidth: 1,
  }
})