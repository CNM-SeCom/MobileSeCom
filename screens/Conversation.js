import React, { useCallback, useState, useLayoutEffect, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions,PermissionsAndroid,Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { GiftedChat , Composer, Send } from 'react-native-gifted-chat';
import { Avatar } from 'react-native-elements';
import { faPhone,faCamera, faInfo, faCircleInfo, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChatDataHash from '../data/dataChat';
import { IconButton } from 'react-native-paper';
import { Icon } from 'react-native-elements'
import WS from 'react-native-websocket'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setChatData } from '../redux/chatDataSlice'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons';

const { width, height } = Dimensions.get('screen');

const Chat = ({ navigation }) => {

    const chatData = useSelector((state) => state.chatData.chatData);
    const [imageMessage, setImageMessage] = useState([]);

    //render nút picker ảnh
    renderCustomActions = (props) => {
      return (
        <TouchableOpacity
          style={styles.iconpicker}
          icon="image"
          onPress={
            () => {
              this.handlePickPicture();
            }
          }
        >
          <FontAwesomeIcon icon={faImage} size={20} color="#009688" style={styles.iconpicker} />
        </TouchableOpacity>
      );
    }

    handlePickPicture = () => {
      console.log('Pick picture');
      openGalleryAvatar();

    }

    const openGalleryAvatar = async () => {
      try {
        const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if(checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission Granted');
          const RESULTS = await launchImageLibrary({mediaType : 'photo'});
          console.log(RESULTS.assets[0].uri);
          imageMessage.push(RESULTS.assets[0].uri);
          //load lại màn hình
          setImageMessage([...imageMessage]);
        }else {
          console.log('Permission Denied');
        }
      } catch (error) {
          console.log(error);
      }
    }

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState(chatData ?? []);
 
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
                    <Text style={styles.headerText}>Kazuha</Text>
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
      }, [navigation, messages]);

    const onSend = useCallback((messages = []) => {
        if(imageMessage){
          messages[0].image = imageMessage;
          setImageMessage([]);
        }
        setMessages(previousMessages => GiftedChat.append(messages, previousMessages))
    }, [messages, imageMessage]);
    useEffect(() => {
      console.log('imageMessage', imageMessage);
      setMessages([chatData]);
    }, [chatData, imageMessage]); 
    return (
       <View style={styles.container}>
     <GiftedChat
        style={{ flex: 1, backgroundColor: 'pink', width: '100%' }}
        messagesContainerStyle={{
          backgroundColor: '#fff',
          width: width,
        }}
        messages={chatData}
        showAvatarForEveryMessage={true}
        onSend={(newMessages) => onSend(newMessages)}
        inverted={false}
        alwaysShowSend={true}  
        renderActions={this.renderCustomActions}     
        renderBubble={(props) => {
          return (
            <View style={[styles.bubble,{
                backgroundColor: props.position === 'left' ? '#fff' : '#009688',
                marginLeft: props.position === 'left' ? 10 : 50,
                marginRight: props.position === 'left' ? 50 : 10,
                marginBottom: 10,
                marginTop: 10,
                borderBottomLeftRadius: props.position === 'left' ? 0 : 10,
                borderBottomRightRadius: props.position === 'left' ? 10 : 0,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
            }]}>
           </View>
          );
        }}
        renderAvatar={(props) => {
            const avatarSource = typeof props.currentMessage.user.avatar === 'string'
              ? { uri: props.currentMessage.user.avatar }
              : props.currentMessage.user.avatar;
          
            return (
              <Avatar rounded source={avatarSource} />
            );
          }}
          
      />
        <View style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'white',
          borderTopWidth: 1,
        }}>
          {imageMessage.length > 0 && imageMessage.map((item, index) => (
              <Image key={index} source={{ uri: item }} style={{ width : 50, height : 50, margin : 5 }} />
            ))}
        </View>
       </View>
       
    );
}

export default Chat;

const styles = StyleSheet.create({
    container : {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bubble: {
        backgroundColor: 'red',
        borderRadius: 10,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        width: 'fit-content',
        whiteSpace: 'pre-wrap',
        maxWidth: '80%'
      },
      avatar: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        backgroundColor: '#009688',
      },
      content: {
        padding: 10,
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
      iconpicker : {
        width: 40,
        height: 40,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
      }
});