import React, { useCallback, useState, useLayoutEffect, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, PermissionsAndroid, Image, Animated, ActivityIndicator, ScrollView,Linking  } from 'react-native';
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
import { useRoute } from '@react-navigation/native';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import Video from 'react-native-video'
import ip from '../data/ip'
import RNFetchBlob from 'rn-fetch-blob';
import { Provider, Portal, Modal, Button } from 'react-native-paper';



const ITEM_HEIGHT = 50;


const { width, height } = Dimensions.get('screen');

const Chat = ({ navigation }) => {

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

  const handleOpenLink = (url) => {
    console.log(url);
    if (url) {
      Linking.openURL(url);
    } else {
      console.log('No url to open');
    }
  };

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


  const route = useRoute();
  const name = route.params.username;
  const id = route.params.chatId;
  const otherParticipantId = route.params.id;
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
  let mess
  // Khai báo biến docment để lưu tài liệu đính kèm
  // console.log('chatData', chatData);

  imageMessage.forEach(element => {
    //nếu đuôi là jpg thì gửi ảnh
    if (element.includes('.jpg' || '.png')) {
      console.log('image');
    }
    else {
      console.log('video');
    }
  });

  handlePickPicture = () => {
    selectImage()
  }

  handlePickVideo = () => {
    openGalleryVideo();
  }

  const removeId = (message, forwardMessage) => {
    // Kiểm tra xem message có tồn tại và có chứa trường _id không
    if (message && message._id) {
      // Tạo một bản sao của message mà không chứa trường _id
      const { _id, ...rest } = message;
      // Cập nhật state với object mới không chứa trường _id
      console.log("LOG", rest);
      setForwardMessage(rest);
      console.log("LOG", forwardMessage);
      console.log('=====================++');
      // setForwardMessage(rest);
      return rest;
    } else {
      console.log("Message does not contain _id field.");
    }
  };
  
  

  useEffect(() => {
    setMessages(chatData);
    scrollToBottom();
  }, [chatData, text, image, video, docment]);
  //auto scroll to bottom when focus creen
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      scrollToBottom();
    });
  }, [navigation]);

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
        <TouchableOpacity
          onLongPress={()=>{
            if(item.user.idUser === user.idUser){
              setIsMyMessage(true);
            }
            else{
              setIsMyMessage(false);
            }
            console.log(isMyMessage);
            handleLongPress(item._id)
            removeId(item,forwardMessage)
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
            if(item.user.idUser === user.idUser){
              setIsMyMessage(true);
            }
            else{
              setIsMyMessage(false);
            }
            console.log(isMyMessage);
            handleLongPress(item.image)
            removeId(item,forwardMessage)            
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
            if(item.user.idUser === user.idUser){
              setIsMyMessage(true);
            }
            else{
              setIsMyMessage(false);
            }
            console.log(isMyMessage);
            handleLongPress(item._id)
            removeId(item,forwardMessage)
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
      return (
        <TouchableOpacity
          onPress={()=>{
            handleOpenLink(item.file)
          }}
        >
          <Text style={{ color: 'black', margin: 10, fontWeight: 'bold', fontSize: 15 }}>{item.user.name} đã gửi 1 tài liệu</Text>
        </TouchableOpacity>
      );
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
          chatId: id,
          text: text,
          type: 'text',
          user: {
            idUser: user.idUser,
            avatar: user.avatar,
            name: user.name,
          },
          receiverId: otherParticipantId,
        }
      }
    };
    const newMessages = [...chatData, config.body.message];
    console.log('L', config.body.message);
    dispatch(addChatData(config.body.message));
    axios.post('http://' + ip + ':3000/ws/send-message-to-user', config.body)
      .then((response) => {
        const newMessagesWithoutData = chatData.filter((message) => message !== config.body.message);
        dispatch(setChatData(newMessagesWithoutData))
        dispatch(addChatData(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      })

    setText('');

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



  const handleSendImage = (uri) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token.accessToken}`
      },
      body: {
        message: {
          chatId: id,
          text: "",
          type: 'image',
          image: uri,
          user: {
            idUser: user.idUser,
            avatar: user.avatar,
            name: user.name,
          },
          receiverId: otherParticipantId,
        }
      }
    }
    dispatch(addChatData(config.body.message));
    axios.post('http://' + ip + ':3000/ws/send-message-to-user', config.body)
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      })
     
  };


  const handleSendVideo = (uri) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token.accessToken}`
      },
      body: {
        message: {
          chatId: id,
          text: "",
          type: 'video',
          video: uri,
          user: {
            idUser: user.idUser,
            avatar: user.avatar,
            name: user.name,
          },
          receiverId: otherParticipantId,
        }
      }
    }
    // dispatch(addChatData(config.body.message));
    axios.post('http://' + ip + ':3000/ws/send-message-to-user', config.body)
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      })

  }

  const uploadImage = async (uri) => {

    await RNFetchBlob.fetch('POST', 'http://' + ip + ':3000/uploadImageMessage', {
      'Content-Type': 'multipart/form-data',
    }, [
      { name: 'image', filename: 'image.jpg', type: 'image/jpeg', data: RNFetchBlob.wrap(uri) }
      ,
      {
        name: 'idUser', data: user.idUser
      }
    ]).then((response) => {
      //format response to json
      response = JSON.parse(response.data);
      handleSendImage(response.uri);
    }).catch((error) => {
      console.error(error);
    });
  };


  const uploadVideo = async (uri) => {
    setLoading(true);
    const data = new FormData();
    data.append('video', {
      uri: uri,
      type: 'video/mp4',
      name: 'video.mp4',
    });
    data.append('idUser', user.idUser); // Gửi idUser cùng với video


    const message = {
      chatId: id,
      text: "",
      type: 'video',
      video: uri,
      user: {
        idUser: user.idUser,
        avatar: user.avatar,
        name: user.name,
      },
      receiverId: otherParticipantId,
    }
    dispatch(addChatData(message));

    try {
      const response = await fetch('http://' + ip + ':3000/cloudinary/uploadVideo', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Kiểm tra nếu response không thành công (status code không phải 2xx)
      if (!response.ok) {
        throw new Error('Server response was not ok');
      }

      // Chuyển đổi response thành đối tượng JSON
      const responseData = await response.json();
      handleSendVideo(responseData.url.url);

      // Xử lý phản hồi từ máy chủ ở đây (nếu cần)
      console.log('Server response:', responseData);


    } catch (error) {
      console.error(error);
  }
};
//delete message
const handleDeleteMesssage = () => {
    //xóa tin nhắn
    axios.post('http://' + ip + ':3000/deleteMessageById', { messageId: messageId })
      .then((response) => {
        console.log(response.data);
        setMenuVisible(false);
        chatData= chatData.filter((message) => message._id !== messageId);
        dispatch(setChatData(chatData));

      })
      .catch((error) => {
        console.log(error);
      })
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
              uri: route.params.avatar
            }} />
            <Text style={styles.headerText}>{name}</Text>
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

  //load lại màn hình khi có tin nhắn mới
  useEffect(() => {
    setMessages([chatData]);
    scrollToBottom();
  }, [ imageMessage]);

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
            onPress={() => setImageMessage([])}
          >
            <FontAwesomeIcon icon={faXmark} size={25} color='#009688' />
          </TouchableOpacity>
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
    // uploadImage(imageMessage[0]);
    if (imageMessage[0].includes('.jpg' || '.png')) {
      uploadImage(imageMessage[0]);
      setImageMessage([]);
    }
    else {
      uploadVideo(imageMessage[0]);
      setImageMessage([]);
    }
  }

  return (
    <Provider>
      <View style={styles.container}>
        <FlatList
          style={{ width: '100%' }}
          data={chatData}
          ref={flatListRef}
          keyExtractor={(item, index) => index.toString()}
          onContentSizeChange={() => scrollToBottom()}
          onLayout={() => scrollToBottom()}
          renderItem={({ item }) => (

            //nếu id người gửi khác với id nguôi dùng thì hiển thị tin nhắn bên trái
            item.user.idUser !== user.idUser ? (
              <View style={[{ justifyContent: 'flex-start' }, styles.bubble]}>
                <Avatar rounded source={{ uri: item.user.avatar }} />
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
                <Avatar rounded source={{ uri: user.avatar }} />

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

        <Portal>
          <Modal style={{ justifyContent: 'center', alignItems: 'center' }} visible={menuVisible} onDismiss={() => setMenuVisible(false)}>
            <View style={{  width: 300, backgroundColor: 'white'}}>
              <View style={{ justifyContent: 'center', alignItems: 'center', width: "100%",height:50, backgroundColor: "#C3F8FF"}}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Tin nhắn</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.buttonMessageOptionDelete} disabled={!isMyMessage} onPress={()=>{
                  handleDeleteMesssage()
                }}>
                  {isMyMessage ? <Text style={styles.messageOption}>Xóa tin nhắn</Text> : null}
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={() => {
                  setMenuVisible(false);
                  console.log("------");
                  console.log(forwardMessage);
                  navigation.navigate('ListFriendForward', { data : forwardMessage });
                }}
                style={styles.buttonMessageOption}>
                  <Text style={styles.messageOption}>Chuyển tiếp tin nhắn</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          <Modal visible={showVideo} onDismiss={() => setShowVideo(false)}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" animating={loadVideo} />
              </View>
              <Video
                source={{ uri: videoUri }}
                style={{ width: "100%", height: 300 }}
                resizeMode="contain"
                controls={true}
                onLoad={() => setLoadVideo(false)}
              />
            </View>
          </Modal>
          <Modal visible={showImage} onDismiss={() => setShowImage(false)}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 1, // Đảm bảo nút hiển thị trên phần còn lại của modal
                }}
                onPress={() => setShowImage(false)}
              >
                <FontAwesomeIcon

                  icon={faXmark} size={30} color='red' onPress={() => setShowImage(false)} />
              </TouchableOpacity>
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: '100%', resizeMode: 'center' }}
              />

            </View>
          </Modal>
          <Portal>
            <Modal
              visible={visible}
              onDismiss={() => setVisible(false)}
              contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20 }}
            >
              {/* tiếp tục */}
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>Bạn có muốn thoát không?</Text>
              <View style={{
                flexDirection: 'row'
              }}>
                <Button onPress={() =>
                  setVisible(false)
                }>Ở lại</Button>
                <Button onPress={() => {
                  setVisible(false)
                  navigation.navigate('Chat')
                }}>Thoát</Button>
              </View>
            </Modal>
          </Portal>
        </Portal>
      </View>
    </Provider>
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
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bubbleLeft: {
    backgroundColor: 'skyblue',
    borderRadius: 10,
    marginLeft: 10,
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
});