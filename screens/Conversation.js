import React, { useCallback, useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { GiftedChat , Composer } from 'react-native-gifted-chat';
import { Avatar } from 'react-native-elements';
import { faPhone,faCamera, faInfo, faCircleInfo, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ChatData from '../data/dataChat';
import { Icon } from 'react-native-elements'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const { width, height } = Dimensions.get('screen');

const Chat = ({ navigation }) => {

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [messages, setMessages] = useState(ChatData);
    const signOutNow = () => {
   
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
      }, [navigation]);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(messages, previousMessages))
    }, []);

    return (
       <View style={styles.container}>
     <GiftedChat
        user={{
            _id: 1,
            name: 'Người Gửi 1',
            avatar: require('../assets/logo1.png'),
            }}
        style={{ flex: 1, backgroundColor: 'pink', width: '100%' }}
        messagesContainerStyle={{
          backgroundColor: '#fff',
          width: width,
        }}
        messages={messages}
        showAvatarForEveryMessage={true}
        onSend={(newMessages) => onSend(newMessages)}
        inverted={false}
        alwaysShowSend={true}
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
              <View style={styles.content}>
                <Text style={styles.text}>{props.currentMessage.text}</Text>
              </View>
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
    
});