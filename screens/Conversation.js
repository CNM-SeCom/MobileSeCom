import React, { useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PermissionsAndroid, Image, Animated } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Avatar } from 'react-native-elements';
import { faPhone, faCamera, faInfo, faCircleInfo, faArrowLeft, faPaperclip, faMicrophone, faVideo } from '@fortawesome/free-solid-svg-icons';
import ChatDataHash from '../data/dataChat';
import { IconButton } from 'react-native-paper';
import { Icon } from 'react-native-elements'
import WS from 'react-native-websocket'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setChatData, addChatData } from '../redux/chatDataSlice'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons';
import chatId from '../redux/chatIdSlice';
import { useRoute } from '@react-navigation/native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Video from 'react-native-video'
import ip from '../data/ip'



const { width, height } = Dimensions.get('screen');

const Chat = ({ navigation }) => {

  const flatListRef = useRef();

  const scrollToBottom = () => {
    if (flatListRef.current && flatListRef.current.scrollToEnd) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatData]);

  useEffect(() => {
    console.log('chatData', chatData);
    setMessages([chatData]);
  }, [chatData, text, image, video, docment]);

  const route = useRoute();
  const name = route.params.username;
  const otherParticipantId = route.params.id;
  const chatData = useSelector((state) => state.chatData.chatData);
  const token = useSelector((state) => state.token.token);
  const user = useSelector((state) => state.user.user);
  const [imageMessage, setImageMessage] = useState([]);
  const [messages, setMessages] = useState(chatData);
  const dispatch = useDispatch();

  const [text, setText] = useState(''); // Khai báo biến text để lưu nội dung tin nhắn
  const [image, setImage] = useState(null); // Khai báo biến image để lưu ảnh đính kèm
  const [video, setVideo] = useState(null); // Khai báo biến video để lưu video đính kèm
  const [docment, setDocment] = useState(null); // Khai báo biến docment để lưu tài liệu đính kèm

  console.log('imageMessage', imageMessage);

  handlePickPicture = () => {
    openGallery();
  }

  handlePickVideo = () => {
    openGalleryVideo();
  }

  console.log('chatData', chatData[0]);

  const openGallery = async () => {
    try {
      const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted');
        const RESULTS = await launchImageLibrary({ mediaType: 'mixed', });
        console.log(RESULTS.assets[0].uri);
        imageMessage.push(RESULTS.assets[0].uri);

        //load lại màn hình
        setImageMessage([...imageMessage]);
        console.log('imageMessage', imageMessage);
      } else {

      }
    } catch (error) {
      console.log(error);
    }
  }
  const openGalleryVideo = async () => {
    try {
      const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      if (checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted');
        const RESULTS = await launchImageLibrary({ mediaType: 'mixed' });
        if (RESULTS.assets && RESULTS.assets.length > 0 && RESULTS.assets[0].uri) {
          console.log(RESULTS.assets[0].uri);
          // Kiểm tra kiểu của tệp được chọn
          if (RESULTS.assets[0].type === 'image') {
            // Xử lý ảnh
            console.log('Selected image: ', RESULTS.assets[0].uri);
          } else if (RESULTS.assets[0].type === 'video') {
            // Xử lý video
            console.log('Selected video: ', RESULTS.assets[0].uri);
          }
        } else {
          console.log('No image or video selected');
        }
      } else {
        console.log('Permission Denied');
      }
    } catch (error) {
      console.log(error);
    }
  }

  renderMessage = (item) => {
    if (item.type === 'text') {
      return (
        <Text style={styles.text}>{item.text}</Text>
      );
    } else if (item.type === 'image') {
      return (
        <Image source={{ uri: item.text }} style={{ width: 200, height: 200 }} />
      );
    } else if (item.type === 'video') {
      return (
        <Video
          source={{ uri: item.text }}
          style={{ width: 200, height: 200 }}
          controls={true}
        />
      );
    } else {
      // Return null or handle other cases
      return null;
    }
  }


  handlesendText = () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token.accessToken}`
      },
      body: {
        message: {
          chatId: "1",
          text: text,
          type: 'text',
          user: {
            idUser: user.idUser,
            avatar: user.avatar,
            name: user.name,
          },
          receiverId: "17106602933470399889699",
          // receiverId: '17106601683500348307336',
        }
      }
    };


    axios.post('http://' + ip + ':3000/ws/send-message-to-user', config.body)
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      })

    setText('');

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
            <Avatar rounded source={require('../assets/logo2.png')} />
            <Text style={styles.headerText}>{name}</Text>
          </View>
          <View style={{
            position: 'absolute',
            marginLeft: 10,
          }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Chat')}
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
  }, [navigation]);

  //load lại màn hình khi có tin nhắn mới
  useEffect(() => {
    console.log('chatData', chatData);
    setMessages([chatData]);
  }, [chatData, imageMessage]);

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
            onPress={handlesendText}>
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
            onPress={handleSendMedia}
            style={{ padding: 10 }}
          >
            <Icon name='send' size={25} color='#009688' />
          </TouchableOpacity>
        </View>
      )
    }
  }

  const handleSendMedia = () => {
    setImageMessage([]);
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ width: '100%' }}
        data={chatData}
        ref={flatListRef}
        onContentSizeChange={() => scrollToBottom()}
        onLayout={() => scrollToBottom()}
        renderItem={({ item }) => (
          //nếu id người gửi khác với id nguôi dùng thì hiển thị tin nhắn bên trái
          item.user._id !== user.idUser ? (
            <View style={[{ justifyContent: 'flex-start' }, styles.bubble]}>
              <Avatar rounded source={require('../assets/logo2.png')} />
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
              <Avatar rounded source={require('../assets/logo2.png')} />

              {/* <Avatar rounded source={{ uri: user.avatar }} /> */}
            </View>
          )
        )}
        keyExtractor={(item) => item._id}
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
  );
}

export default Chat;

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
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bubbleLeft: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 10,
    marginLeft: 10,
  },
  bubbleRight: {
    backgroundColor: '#009688',
    padding: 10,
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
  }
});