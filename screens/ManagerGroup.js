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


const ManagerGroup = () => {

    const navigation = useNavigation()
    const route = useRoute().params.params
    const user = useSelector(state => state.user.user)

    console.log(route.participants);
    console.log(user);
    
    const [participants, setParticipants] = useState([route.participants])
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isModalChangeNameVisible, setIsModalChangeNameVisible] = useState(false)
    const [isModalChangeAvatarVisible, setIsModalChangeAvatarVisible] = useState(false)
    const [listFriend, setListFriend] = useState(user.listFriend)
    const [listFriendSearch, setListFriendSearch] = useState(user.listFriend)
    const [nameGroup, setNameGroup] = useState(route.username)
    const [avatarGroup, setAvatarGroup] = useState(route.avatar)
    const [isAdmin, setIsAdmin] = useState(false)

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
        console.log(idUser);
       //nếu user.IdUser có trong mảng participants và là admin thì trả về true
        const check = route.participants.find((item) => item.idUser === idUser && item.role === 'admin')
        if (check) {
            return true
        }
        return false
    }

    useEffect(() => {
        setIsAdmin(handleCheckAddmin())
    }, [isAdmin])

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
                        const newParticipants = route.participants.filter((item) => item.idUser !== index)
                        route.participants = newParticipants
                        setParticipants(newParticipants)
                        //set lại listFriend
                        const newFriend = user.listFriend.filter((item) => item.idUser === index)
                        setListFriend(newFriend)
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const handleSearch = (text) => {
        //tìm cả hoa lẫn thường
        const newText = text.toLowerCase()
        const newParticipants = route.participants.filter((item) => item.name.toLowerCase().includes(newText))
        setParticipants(newParticipants)
    }

    const handleAddParticipant = (idUser) => {
        const newParticipant = user.listFriend.find((item) => item.idUser === idUser)
        route.participants.push(newParticipant)
        setParticipants(route.participants)
        //set lại listFriend
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

    const handleChangeNameGroup = (nameGroup) => {
        setNameGroup(nameGroup)
        route.username = nameGroup
        setIsModalChangeNameVisible(false)
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

    const handleChangeAvatarGroup = (avatarGroup) => {
        setAvatarGroup(avatarGroup)
        route.avatar = avatarGroup
        setIsModalChangeAvatarVisible(false)
    }

    const handleOrdainedAdmin = (idUser) => {
        const newParticipants = route.participants.map((item) => {
            if (item.idUser === idUser) {
                item.role = 'admin'
            }
            return item
        })
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
                        >Modal Add Member</Text>
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
                                                onPress={() => handleAddParticipant(item.idUser)}
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
                        isAdmin === false ? (
                            <TouchableOpacity
                            onPress={() => handleOutGroup()}
                            style={[styles.buttonControl, { marginBottom: 20 }]}
                        >
                            <Text style={styles.textButton}>
                                Rời nhóm
                            </Text>
                        </TouchableOpacity>
                        ):
                        (
                            <View style={{marginBottom: 20}}>
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
                                            route.participants.map((item, index) => (
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
                                                    <TouchableOpacity
                                                        onPress={() => handleRemoveParticipant(item.idUser)}
                                                        style={{ position: 'absolute', right: 10 }}
                                                    >
                                                        <FontAwesomeIcon icon={faUserXmark} size={20} color='black' />
                                                    </TouchableOpacity>
                                                    {
                                                        isAdmin && (
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    handleOrdainedAdmin(item.idUser),
                                                                    handleRemoveAdmin(item.idUser)
                                                                    setIsAdmin(false)
                                                                }}
                                                                style={{ position: 'absolute', right: 50 }}
                                                            >
                                                                <FontAwesomeIcon icon={faKey} size={20} color='black' />
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                </View>

                                            ))
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
                        isAdmin && (
                            <TouchableOpacity
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