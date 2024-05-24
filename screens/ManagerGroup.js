import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, TextInput, ScrollView, KeyboardAvoidingView, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useRoute } from '@react-navigation/native'
import { text } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faUserXmark, faX, faUserPlus, faKey } from '@fortawesome/free-solid-svg-icons'
import { Alert } from 'react-native'
import { useRef } from 'react'
import { Keyboard } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import ip from '../data/ip';
import RNFetchBlob from 'rn-fetch-blob'
import AsyncStorage from '@react-native-async-storage/async-storage'


const ManagerGroup = () => {

    const navigation = useNavigation()
    let route = useRoute().params.params
    const user = useSelector(state => state.user.user)

    

    let [participants, setParticipants] = useState([route.participants])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isModalChangeNameVisible, setIsModalChangeNameVisible] = useState(false)
    const [isModalChangeAvatarVisible, setIsModalChangeAvatarVisible] = useState(false)
    const [listFriend, setListFriend] = useState(user.listFriend)
    const [listFriendSearch, setListFriendSearch] = useState(user.listFriend)
    const [nameGroup, setNameGroup] = useState(route.username)
    const [avatarGroup, setAvatarGroup] = useState(route.avatar)
    const [isAdmin, setIsAdmin] = useState(false)

    let participantsSlice = useSelector(state => state.groupInfo.groupInfo)

    // console.log('participantsSlice', participantsSlice);

    useEffect(() => {
        if (participantsSlice) {
            // console.log('participantsSlice', participantsSlice);
            setParticipants(participantsSlice.participants)
            //load lại listFriend
            const newFriend = user.listFriend.filter((item) => item.idUser !== user.idUser)
            setListFriend(newFriend)
            //load lại participants
            route.participants = participantsSlice.participants
        }
    }, [participantsSlice])

    useEffect(() => {

    }, [participants])

    //nếu idUser đã tồn tại trong mảng participants thì không thêm
    const checkExist = (idUser) => {
        const check = route.participants.find((item) => item.idUser === idUser)
        if (check) {
            return true
        }
        return false
    }

    const handleCheckAddmin = () => {
        let idUser = user.idUser
       //nếu user.IdUser có trong mảng participants và là admin thì trả về true
        let check = route.participants.find((item) => item.idUser === idUser && item.role === 'admin')
        if (check) {
            return true
        }
        return false
    }


    useEffect(() => {
    }, [handleCheckAddmin()])

    const handleRemoveParticipant = (index) => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn xóa người tham gia này?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {

                        data = {
                            idUser: index,
                            chatId: route.chatId
                        }
                     

                        axios.post('http://'+ip+'/leaveOrKickoutGroupChat', data)
                        handleSendNotifyRemoveToGroup(route.participants.find((item) => item.idUser === index).name, index)

                        const newParticipants = route.participants.filter((item) => item.idUser !== index)
                        route.participants = newParticipants
                        // setParticipants(newParticipants)
                       
                        //set lại listFriend
                        const newFriend = user.listFriend.filter((item) => item.idUser === index)
                        setListFriend(newFriend)
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleSendNotifyRemoveToGroup = (name,idKick) => {
        data = {
            listReceiver: route.participants,
            message: {
            chatId: route.chatId,
            text: name  + ' đã bị đuổi khỏi nhóm',
            type: 'KICKOUT_MEMBER',
            user: {
                idUser: user.idUser,
                avatar: user.avatar,
                name: user.name,
            },
            receiverId: '',
            idKickOut: idKick,
            participants: route.participants
            }
        }
        axios.post('http://'+ip+'/ws/send-message-to-group/'+route.chatId , data)
    }



    const handleSendNotifyAddToGroup = (name, newParticipant) => {
        data = {
            listReceiver: route.participants,
            message: {
            chatId: route.chatId,
            text: name  + ' đã được mời vào nhóm',
            type: 'ADD_MEMBER',
            user: {
                idUser: user.idUser,
                avatar: user.avatar,
                name: user.name,
            },
            receiverId: '',
            participants: newParticipant
            }
        }
        axios.post('http://'+ip+'/ws/send-message-to-group/'+route.chatId , data)
    }

    const handleSendNotifyLeaveGroup = (name, newParticipant) => {
        data = {
            listReceiver: route.participants,
            message: {
            chatId: route.chatId,
            text: name  + ' đã rời nhóm',
            type: 'LEAVE_GROUP',
            user: {
                idUser: user.idUser,
                avatar: user.avatar,
                name: user.name,
            },
            receiverId: '',
            participants: newParticipant
            }
        }
        axios.post('http://'+ip+'/ws/send-message-to-group/'+route.chatId , data)
    }

    const handleSendNotifySetAdmin = (name, listPaticipant) => {
        data = {
            listReceiver: route.participants,
            message: {
            chatId: route.chatId,
            text: name  + ' đã được chỉ định làm admin',
            type: 'SET_ADMIN',
            user: {
                idUser: user.idUser,
                avatar: user.avatar,
                name: user.name,
            },
            receiverId: '',
            participants: listPaticipant
            }
        }
        axios.post('http://'+ip+'/ws/send-message-to-group/'+route.chatId , data)
    }

    const handleSendNotifyDeleteGroup = () => {
        data = {
            listReceiver: route.participants,
            message: {
            chatId: route.chatId,
            text: 'Nhóm đã bị giải tán',
            type: 'DELETE_CHAT',
            user: {
                idUser: user.idUser,
                avatar: user.avatar,
                name: user.name,
            },
            receiverId: '',
            // participants: route.participants
            }
        }
        axios.post('http://'+ip+'/ws/send-message-to-group/'+route.chatId , data)
      }

    const handleSearch = (text) => {
        //tìm cả hoa lẫn thường
        const newText = text.toLowerCase()
        const newParticipants = route.participants.filter((item) => item.name.toLowerCase().includes(newText))
        setParticipants(newParticipants)
    }

    const handleAddParticipant = (idUser) => {
        let newParticipant = user.listFriend.find((item) => item.idUser === idUser);
        newParticipant = {...newParticipant, role: 'member'}
        let newListParticipant = [...route.participants, newParticipant]

        axios.post('http://'+ip+'/addMemberToGroupChat', {chatId: route.chatId, listMember: [newParticipant]})
        handleSendNotifyAddToGroup(newParticipant.name,newListParticipant)

        const newFriend = user.listFriend.filter((item) => item.idUser !== idUser)
        setListFriend(newFriend)

    }

    const scrollViewRef = useRef()
    //roll to bottom    
    const handleScroll = () => {
        scrollViewRef.current.scrollToEnd({ animated: true })
    }
    const handleScrollOnKeyboardShow = () => {
        handleScroll();
    };
    useEffect(() => {
        Keyboard.addListener('keyboardDidShow', handleScrollOnKeyboardShow);

        // Clean up function
        return () => {
            Keyboard.removeAllListeners('keyboardDidShow', handleScrollOnKeyboardShow);
        };
    }, []);
        

    const handleSearchFriend = (text) => {
        const newFriend = user.listFriend.filter((item) => item.name.includes(text))
        setListFriendSearch(newFriend)
    }



    const handleDeleteGroup = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn xóa nhóm?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        axios.post('http://'+ip+'/deleteChat', { chatId: route.chatId })
                        handleSendNotifyDeleteGroup()                    
                        navigation.navigate('Home')
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const handleChangeNameGroup = (nameGroup) => {

        axios.post('http://'+ip+'/changeGroupName', { chatId: route.chatId, groupName: nameGroup })
        handleSendNotifyChangeGroupName(nameGroup)
        setNameGroup(nameGroup)
        route.username = nameGroup
        setIsModalChangeNameVisible(false)
    }

    const handleSendNotifyChangeGroupName = (nameGroup) => {
        data = {
            listReceiver: route.participants,
            message: {
            chatId: route.chatId,
            text: 'Tên nhóm đã được thay đổi thành ' + nameGroup,
            type: 'CHANGE_NAME',
            user: {
                idUser: user.idUser,
                avatar: user.avatar,
                name: user.name,
            },
            receiverId: '',
            groupName: nameGroup
            }
        }
        axios.post('http://'+ip+'/ws/send-message-to-group/'+route.chatId , data)
    }

    const selectImage = async () => {
        const result = await launchImageLibrary({
          mediaType: 'photo',
          quality: 1,
        });
    
        if (result.didCancel) {
          console.log('User cancelled image picker');
        } else if (result.error) {
          console.log('ImagePicker Error: ', result.error);
        } else {
          setAvatarGroup(result.assets[0].uri);
        }
      };

      const uploadImage = async (uri) => {
        console.log('uploadImage', uri);
        await RNFetchBlob.fetch('POST', 'http://' + ip + '/uploadImageMessage', {
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
          handleChangeAvatarGroup(response.uri);
        }).catch((error) => {
          console.error(error);
        });
      };

    const handleChangeAvatarGroup = (avatarGroup) => {
        
        axios.post('http://'+ip+'/changeAvatarGroup', { chatId: route.chatId, avatar: avatarGroup
    })
        handleSendNotifychangeAvatarGroup(avatarGroup)
        setAvatarGroup(avatarGroup)
        route.avatar = avatarGroup
        setIsModalChangeAvatarVisible(false)
    }

    const handleSendNotifychangeAvatarGroup = (avatarGroup) => {
        data = {
            listReceiver: route.participants,
            message: {
            chatId: route.chatId,
            text: 'Ảnh đại diện nhóm đã được thay đổi',
            type: 'CHANGE_AVATAR',
            user: {
                idUser: user.idUser,
                avatar: user.avatar,
                name: user.name,
            },
            receiverId: '',
            avatarGroup: avatarGroup
            }
        }
        axios.post('http://'+ip+'/ws/send-message-to-group/'+route.chatId , data)
    }

    const handleOrdainedAdmin = (idUser) => {
        const newParticipants = route.participants.map((item) => {
            if (item.idUser === idUser) {
                item.role = 'admin'
            }
            return item
        })

        data = {
           chatId: route.chatId,
           listParticipant : newParticipants
        }
        axios.post('http://'+ip+'/setAdminForMember', data)
        handleSendNotifySetAdmin(route.participants.find((item) => item.idUser === idUser).name, newParticipants)
        route.participants = newParticipants
        setParticipants(newParticipants)
    }

    const handleRemoveAdmin = (idUser) => {
        const newParticipants = route.participants.map((item) => {
            if (item.idUser === idUser) {
                item.role = 'member'
            }
            return item
        })

  
        

        route.participants = newParticipants
        setParticipants(newParticipants)
    }

    const handleOutGroup = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn rời nhóm?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        const newParticipants = route.participants.filter((item) => item.idUser !== user.idUser)
                        route.participants = newParticipants

                        data = {
                            idUser: user.idUser,
                            chatId: route.chatId,
                        }

                        axios.post('http://'+ip+'/leaveOrKickoutGroupChat', data)
                        handleSendNotifyLeaveGroup(user.name, newParticipants)
                        navigation.navigate('Home')

                        setParticipants(newParticipants)
                        navigation.navigate('Home')
                    },
                },
            ],
            { cancelable: false }
        );
    }

    const renderModalAddMember = () => {
        return (
            <Modal
                visible={isModalVisible}
                transparent={true}
                animationIn='slideInUp'
                animationOut='fadeOutRight'

            >
                <View style={styles.modalAddMemberWrapper}>
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(false)}
                        style={styles.buttonCloseModalAddMember}
                    >
                        <FontAwesomeIcon icon={faX} size={30} color='black' />
                    </TouchableOpacity>
                    <View
                        style={styles.searchModalWrapper}
                    >
                        <Text
                            style={styles.textAddMember}
                        >Thêm ai dô nè</Text>
                    </View>
                    <View>
                        <TextInput
                            placeholderTextColor={'gray'}
                            placeholder="Tìm kiếm"
                            style={styles.textInputSearchModal}
                            onChangeText={(text) => handleSearchFriend(text)}
                        />
                        <TouchableOpacity
                            style={[styles.iconSearch, { marginTop: 15 }]}
                        >
                            <FontAwesomeIcon icon={faSearch} size={20} color='black' />
                        </TouchableOpacity>
                    </View>
                    <View
                        style={styles.listFriendWrapper}
                    >
                        <FlatList
                            data={listFriendSearch ? listFriendSearch : user.listFriend}
                            keyExtractor={(item) => item.idUser}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    //phần tử cuối cùng thì thêm marginBottom
                                    style={
                                        item.idUser === user.listFriend[user.listFriend.length - 1].idUser ?
                                            [{ marginBottom: 10 }, styles.buttonControl] :
                                            styles.buttonControl
                                    }
                                >
                                    <Image
                                        source={{ uri: item.avatar }}
                                        style={{ width: 40, height: 40, borderRadius: 20 }}
                                    />
                                    <Text style={[styles.textButton, { marginLeft: 10 }]}>{item.name}</Text>
                                    {
                                        !checkExist(item.idUser) && (
                                            <TouchableOpacity
                                                onPress={() =>{
                                                    handleAddParticipant(item.idUser)
                                                }}
                                                style={{ position: 'absolute', right: 10 }}
                                            >
                                                <FontAwesomeIcon icon={faUserPlus} size={20} color='black' />
                                            </TouchableOpacity>
                                        )
                                    }

                                </TouchableOpacity>
                            )}
                        />

                    </View>
                </View>

            </Modal>
        );
    }

    const renderModalChangeName = () => {
        return (
            <Modal
                visible={isModalChangeNameVisible}
                transparent={true}
                animationIn='slideInUp'
                animationOut='fadeOutRight'
               
            >
                <View style={styles.modalChangeNameWrapper}>
                    <TouchableOpacity
                        onPress={() => setIsModalChangeNameVisible(false)}
                        style={styles.buttonCloseModalChangeName}
                    >
                        <FontAwesomeIcon icon={faX} size={30} color='black' />
                    </TouchableOpacity>
                    <View
                        style={styles.searchModalWrapper}
                    >
                        <Text
                            style={styles.textChangeName}
                        >Modal Change Name</Text>
                    </View>
                    <View>
                        <TextInput
                            placeholderTextColor={'gray'}
                            placeholder="Nhập tên mới"
                            style={styles.textInputSearchModal}
                            onChangeText={(text) => setNameGroup(text)}
                        />
                        <TouchableOpacity
                            style={[styles.iconSearch, { marginTop: 15 }]}
                        >
                            <FontAwesomeIcon icon={faSearch} size={20} color='black' />
                        </TouchableOpacity>
                    </View>
                    {/* button change name */}
                    <TouchableOpacity
                        onPress={() => handleChangeNameGroup(nameGroup)}
                        style={[styles.buttonChangeName, { marginTop: 10 }]}
                    >
                        <Text style={styles.textButton}>
                            Đổi tên
                        </Text>
                    </TouchableOpacity>
    
                </View>

            </Modal>
        );
    }

    const renderModalChangeAvatar = () => {
        return (
            <Modal
                visible={isModalChangeAvatarVisible}
                transparent={true}
                animationIn='slideInUp'
                animationOut='fadeOutRight'

            >
                <View style={styles.modalChangeAvatarWrapper}>
                    <TouchableOpacity
                        onPress={() => setIsModalChangeAvatarVisible(false)}
                        style={styles.buttonCloseModalChangeAvatar}
                    >
                        <FontAwesomeIcon icon={faX} size={30} color='black' />
                    </TouchableOpacity>
                    <View
                        style={styles.searchModalWrapper}
                    >
                        <Text
                            style={styles.textChangeAvatar}
                        >Modal Change Avatar</Text>
                    </View>
                
                   <View
                     style={styles.chageAvatarWrapper}
                   >
                    <Image
                            source={{ uri: avatarGroup ? avatarGroup : route.avatar}}
                            style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginTop: 10 }}
                        />
                   </View>
                   <View style={{ 
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                          width: '100%',
                    }} >
                    <TouchableOpacity
                            onPress={() => selectImage()}
                            style={[styles.buttonChangeAvatar, { marginTop: 10 }]}
                        >
                            <Text style={styles.textButton}>
                                Chọn avatar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => handleChangeAvatarGroup(avatarGroup)}
                            style={[styles.buttonChangeAvatar, { marginTop: 10 }]}
                        >
                            <Text style={styles.textButton}>
                                Đổi avatar
                            </Text>
                        </TouchableOpacity>
                   </View>
                </View>

            </Modal>
        );
    }
        

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

        >
            <ScrollView
                ref={scrollViewRef}
                showsVerticalScrollIndicator={false}
                style={styles.container}
                contentContainerStyle={{
                    alignItems: 'center',
                    paddingBottom: 20
                }}
            >
                <View
                    style={styles.containerLogo}
                >
                    <LinearGradient
                        colors={['#C3F8FF', '#75E4FF']} // Mảng màu của gradient
                        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                        style={styles.linearGradient}
                    />
                    <View
                        style={styles.avatarWrapper}
                    >
                        <Image
                            source={{ uri: route.avatar }}
                            style={styles.avatar}
                        />

                    </View>
                </View>

                <View
                    style={styles.nameWrapper}
                >
                    <LinearGradient
                        colors={['#C3F8FF', '#75E4FF']} // Mảng màu của gradient
                        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                        style={styles.linearGradient}
                    />
                    <View
                        style={{ flex: 1, justifyContent: 'center' }}
                    >
                        <Text style={styles.name}>
                            {route.username}
                        </Text>
                    </View>
                </View>
                <View
                    style={styles.controlwrapper}
                >
                    <LinearGradient
                        colors={['#C3F8FF', '#75E4FF']} // Mảng màu của gradient
                        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                        style={styles.linearGradient}
                    />
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        style={styles.buttonControl}
                    >
                        <Text style={styles.textButton}>
                            Thêm thành viên
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsModalChangeNameVisible(true)}
                        style={styles.buttonControl}
                    >
                        <Text style={styles.textButton}>
                            Đổi tên nhóm
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsModalChangeAvatarVisible(true)}
                        style={[styles.buttonControl]}
                    >
                        <Text style={styles.textButton}>
                            Đổi avatar
                        </Text>
                    </TouchableOpacity>
                    {
                        handleCheckAddmin() === false ? (
                            <TouchableOpacity
                            onPress={() => handleOutGroup()}
                            style={[styles.buttonControl, { marginBottom: 20 }]}
                        >
                            <Text style={styles.textButton}>
                                Rời nhóm
                            </Text>
                        </TouchableOpacity>
                        ) : (
                            <View style={{ marginBottom : 10 }}>

                            </View>
                        )
                        
                    }

                </View>
                <View
                    style={styles.listParticipantWrapper}
                >
                    <LinearGradient
                        colors={['#C3F8FF', '#75E4FF']} // Mảng màu của gradient
                        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                        style={styles.linearGradient}
                    />
                    <View
                        style={styles.searchWrapper}
                    >
                        <TextInput
                            placeholderTextColor={'gray'}
                            placeholder="Tìm kiếm"
                            style={styles.textInputSearch}
                            onChangeText={(text) => handleSearch(text)}
                        />
                        <TouchableOpacity
                            style={styles.iconSearch}
                        >
                            <FontAwesomeIcon icon={faSearch} size={20} color='black' />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <ScrollView
                            style={{ width: '100%', height: 'fit-content' }}
                        >
                            <View
                                style={{
                                    marginTop: 10,
                                }}
                            >
                                {
                                    participants ?
                                        (
                                            route.participants.map((item, index) => {
                                                if(item.idUser !== user.idUser){
                                                    return( 
                                                        <View
                                                            //nếu index cuối thì thêm marginBottom
                                                            style={index === route.participants.length - 1 ?
                                                                [{ marginBottom: 10 }, styles.buttonControl] :
                                                                styles.buttonControl}
                                                                key={index}
                                                        >
                                                            <Image
                                                                source={{ uri: item.avatar }}
                                                                style={{ width: 40, height: 40, borderRadius: 20 }}
                                                            />
                                                            <Text style={[styles.textButton, { marginLeft: 10 }]}>{item.name}</Text>
                                                            {
                                                                handleCheckAddmin() === true ? (
                                                                    <TouchableOpacity
                                                                onPress={() => handleRemoveParticipant(item.idUser)}
                                                                style={{ position: 'absolute', right: 10 }}
                                                            >
                                                                <FontAwesomeIcon icon={faUserXmark} size={20} color='black' />
                                                            </TouchableOpacity>
                                                                ): null
                                                            }
        
                                                           {
                                                            handleCheckAddmin() === true ?
                                                            <View
                                                                style={{ position: 'absolute', right: 0, bottom : 30}}
                                                            >
                                                                {
                                                                (item.role === 'member') ? (
                                                                    <TouchableOpacity
                                                                        onPress={() => {
                                                                            handleOrdainedAdmin(item.idUser)
                                                                            //set lại role thành member
                                                                            
                                                                        }}
                                                                        style={{ position: 'absolute', right: 50 }}
                                                                    >
                                                                        <FontAwesomeIcon icon={faKey} size={20} color='black' />
                                                                    </TouchableOpacity>
                                                                ) :(null)
                                                            }
                                                            </View>
                                                            :null
                                                            
                                                           }
                                                        </View>
        
                                                        )
                                                }
                                            })
                                        ) : (
                                            participants.map((item, index) => (
                                                <View
                                                    //nếu index cuối thì thêm marginBottom
                                                    style={index === route.participants.length - 1 ?
                                                        [{ marginBottom: 10 }, styles.buttonControl] :
                                                        styles.buttonControl}
                                                    key={index}
                                                >
                                                    <Image
                                                        source={{ uri: item.avatar }}
                                                        style={{ width: 40, height: 40, borderRadius: 20 }}
                                                    />
                                                    <Text style={[styles.textButton, { marginLeft: 10 }]}>{item.name}</Text>
                                                    {
                                                        isAdmin && (
                                                            <TouchableOpacity
                                                                onPress={() => handleRemoveParticipant(item.idUser)}
                                                                style={{ position: 'absolute', right: 10 }}
                                                            >
                                                                <FontAwesomeIcon icon={faUserXmark} size={20} color='black' />
                                                            </TouchableOpacity>
                                                        )
                                                    }

                                                </View>

                                            ))
                                        )
                                }

                            </View>
                        </ScrollView>



                    </View>

                </View>
                <View
                    style={styles.controlwrapper}
                >
                    <LinearGradient
                        colors={['#C3F8FF', '#75E4FF']} // Mảng màu của gradient
                        start={{ x: 0.0, y: 0.25 }} end={{ x: 0.5, y: 1.0 }}
                        style={styles.linearGradient}
                    />
                    {
                        handleCheckAddmin() === true && (
                            <TouchableOpacity
                                onPress={() => handleDeleteGroup()}
                                style={[styles.buttonControl, { marginBottom: 10 }]}
                            >
                                <Text style={styles.textButton}>
                                    Giải tán
                                </Text>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </ScrollView>
            {renderModalAddMember()}
            {renderModalChangeName()}
            {renderModalChangeAvatar()}
        </KeyboardAvoidingView>
    )
}

export default ManagerGroup

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerLogo: {
        width: '95%',
        height: 170,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'pink',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 15,
        marginTop: 10
    },
    linearGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    avatar: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        borderRadius: 60,
    },
    avatarWrapper: {
        width: 120,
        height: 120,
        borderWidth: 3,
        borderColor: 'white',
        overflow: 'hidden',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameWrapper: {
        width: '95%',
        height: 45,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        elevation: 15, overflow: 'hidden',

    },
    name: {
        fontSize: 20,
        color: 'black',
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    controlwrapper: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        elevation: 15,
        overflow: 'hidden',

    },
    buttonControl: {
        flexDirection: 'row',
        width: '90%',
        height: 50,
        alignItems: 'center',
        borderBottomColor: 'gray',
        backgroundColor: 'white',
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 10,
        elevation: 9,
        paddingLeft: 10
    },
    textButton: {
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold'
    },
    listParticipantWrapper: {
        width: '95%',
        height: 'fit-content',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        elevation: 15,
        overflow: 'hidden',
    },
    searchWrapper: {
        width: '90%',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        alignSelf: 'center',
    },
    textInputSearch: {
        width: '100%',
        height: 40,
        alignSelf: 'center',
        borderRadius: 10,
        color: 'black',
        paddingLeft: 10,
    },
    iconSearch: {
        width: 30,
        height: 30,
        marginTop: 10,
        position: 'absolute',
        right: 15,
        justifyContent: 'center',
    },
    modalAddMemberWrapper: {
        width: '100%',
        height: '80%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
    },
    searchModalWrapper: {
        width: '80%',
        height: 50,
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 15,
        overflow: 'hidden',
        marginTop: 10,
        justifyContent: 'center',
        marginLeft: 10,
    },
    textAddMember: {
        fontSize: 20,
        color: 'black',
        fontWeight: '900',
        alignSelf: 'center',
    },
    buttonCloseModalAddMember: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top: 15,
    },
    listFriendWrapper: {
        width: '95%',
        height: '75%',
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 15,
        overflow: 'hidden',
        alignSelf: 'center',
        marginTop: 10,
    },
    textInputSearchModal: {
        width: '95%',
        height: 40,
        alignSelf: 'center',
        borderRadius: 10,
        color: 'black',
        paddingLeft: 10,
        marginTop: 10,
        backgroundColor: 'white',
    },
    modalChangeNameWrapper: {
        width: '100%',
        height: 175,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
    },
    textChangeName: {
        fontSize: 20,
        color: 'black',
        fontWeight: '900',
        alignSelf: 'center',
    },
    buttonCloseModalChangeName: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top: 15,
    },
    buttonChangeName: {
        width: '95%',
        height: 45,
        alignItems: 'center',
        backgroundColor: '#75E4FF',
        alignSelf: 'center',
        borderRadius: 10,
        elevation: 9,
        justifyContent: 'center',
    },
    modalChangeAvatarWrapper: {
        width: '100%',
        height: 'fit-content',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        paddingBottom: 10,
    },
    textChangeAvatar: {
        fontSize: 20,
        color: 'black',
        fontWeight: '900',
        alignSelf: 'center',
    },
    buttonCloseModalChangeAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 10,
        top: 15,
    },
    chageAvatarWrapper: {
        width: '95%',
        height: 'fit-content',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        elevation: 15, overflow: 'hidden',
        alignSelf: 'center',
        paddingBottom: 10
    },
    buttonChangeAvatar: {
        width: '45%',
        height: 45,
        alignItems: 'center',
        backgroundColor: '#75E4FF',
        alignSelf: 'center',
        borderRadius: 10,
        elevation: 9,
        justifyContent: 'center',
    }
})