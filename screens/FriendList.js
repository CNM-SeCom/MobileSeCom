import { Button,TouchableHighlight, Modal,StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import { selectUser } from '../slices/userSlice'
import { useState} from 'react'
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import ip from '../data/ip';
import { List } from 'react-native-paper';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPalette, faRightFromBracket,faBars } from '@fortawesome/free-solid-svg-icons';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Load from '../components/Load';
import { LogBox } from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Provider } from 'react-native-paper';

LogBox.ignoreLogs(['Warning: ...'])
LogBox.ignoreAllLogs();


const FriendList = () => {
    const user = useSelector((state) => state.user.user);
    const [listFriendRequest, setListFriendRequest] = useState('');
    const [listFriend, setListFriend] = useState('');
    const userId = user.idUser;
    const [modalVisible, setModalVisible] = useState(false);
    let [loading, setLoading] = useState(false);
    const [loadingFriend, setLoadingFriend] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [friendId, setFriendId] = useState('');
    const blockFriend = (id) => {
        console.log('Chặn' + id)
    }
    const mode = useSelector((state) => state.mode.mode);
    const colors = useSelector((state) => {
        switch (mode) {
          case 'dark':
            return state.theme.darkColors;
          default:
            return state.theme.lightColors;
        }
    });

    useEffect(() => {
        getListFriendByUserId(user.idUser);
        getSentRequestAddFriendByUserId(user.idUser);
    },[user])

    useFocusEffect(
        React.useCallback(() => {
            setLoadingFriend(true);
            console.log('Bio Screen focused');
        }, [])
    );

    useEffect(() => {

    },[loadingFriend])

    

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const handleNotify = (receiverId) => {
        const data = {
          receiverId: receiverId,
          name : ' '
        }

        console.log('data notify', data);
        axios.post('https://'+ip+'/ws/sendNotifyAddFriendToUser', data)
        .then((response) => {
          console.log("notify")
          console.log(response.data);
        })
      }

    const reloadUser = async () => {
        setLoadingFriend(true);
        const idUser = await AsyncStorage.getItem('idUser');
        const userToken = await AsyncStorage.getItem('userToken');

        console.log('idUser', idUser);
        console.log('userToken', userToken);

        await axios.post('https://' + ip + '/checkLoginWithToken', {refreshToken: userToken, idUser: idUser})
        .then(res => {
          console.log(res.data);
          dispatch(setUser(res.data.data));
            setLoadingFriend(false);
        })
    }

 


    //Danh sach gửi yêu cầu kết bạn
    async function getSentRequestAddFriendByUserId(id) {
        setLoadingFriend(true);
        const listFriendRequest = listFriendRequest;
        const data={
            idUser: id
        }
    await axios.post('https://' + ip + '/getSentRequestAddFriendByUserId',data).then((res) => {
        console.log(res.data.data);
        setListFriendRequest(res.data.data);
        setLoading(false);
        setLoadingFriend(false);
        return res.data.data;
    }).catch((err) => {
      console.log(err);
    })
    }
    //Danh sách bạn bè
    async function getListFriendByUserId(id) {
        setLoadingFriend(true);
        const data={
            idUser: id,
            listFriend:listFriend
        }
        await axios.post('https://' + ip + '/getListFriendByUserId',data).then((res) => {
        setListFriend(res.data.data);
        setLoading(false);
        setLoadingFriend(false);
        return res.data.data;
    }).catch((err) => {
      console.log(err);
    })
    }
    //Huy loi moi ket ban
    async function cancelRequestAddFriend(request) {
        await axios.post('https://' + ip + '/cancelRequestAddFriend',request).then((res) => {
        getSentRequestAddFriendByUserId(userId);
        handleNotify(request.toUser);
        setLoading(false);
        return res.data.data;
    }).catch((err) => {
      console.log(err);
    })
    }
    //Hủy kết bạn
    async function unFriend(idUser,idFriend) {
        setLoadingFriend(true);
        const data={
            idUser:idUser,
            friendId:idFriend
        }
        await axios.post('https://' + ip + '/unFriend',data).then((res) => {
        getListFriendByUserId(userId);
        handleNotify(idFriend);
        reloadUser();
        setLoading(false);
        setLoadingFriend(false);
        return res.data.data;
    }).catch((err) => {
      console.log(err);
    })
    }
    useEffect(() => {
        getSentRequestAddFriendByUserId(userId);
        getListFriendByUserId(userId);
    },[]) 
    return (
        <Provider>
            <View style={{backgroundColor:colors.background,width:'100%',flex:1}}>
            <View>
            <Text style={{justifyContent:'center',alignItems:'center',textAlign:'center',fontSize:20,color:'white', margin:10}}>Yêu cầu kết bạn</Text>
            <FlatList
                contentContainerStyle={{
                    paddingBottom: 20,backgroundColor:colors.background
                }}
                style={styles.listRequestContainer}
                data={listFriendRequest}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View
                        style={styles.viewRequestUnit}
                    >
                        <View
                            style={styles.wrapperAvatarName}
                        >
                            <View
                                style={styles.avatarWrapper}
                            >
                                <Image
                                    source={{uri:item.avatarToUser}}
                                    style={styles.avatar}
                                />
                            </View>
                            <View>
                                <Text
                                    style={styles.name}
                                >{item.nameToUser}</Text>
                            </View>
                           
                        </View>
                        <View>
                        <TouchableOpacity
                                    style={styles.buttonDecline}
                                    onPress={() => {
                                        {
                                        cancelRequestAddFriend(item)
                                        setLoading(true)
                                        }
                                    }}
                                >
                                    <Text
                                        style={styles.textButton}
                                    >Hủy yêu cầu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            </View>
            <View>
                <Text style={{justifyContent:'center',alignItems:'center',textAlign:'center',fontSize:20,color:'white',margin:10}}>Danh sách bạn bè</Text>
                <FlatList
                contentContainerStyle={{
                    paddingBottom: 20,
                }}
                style={styles.listFriendContainer}
                data={listFriend}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View
                        style={styles.viewRequestUnit}
                    >
                        <View
                            style={styles.wrapperAvatarName}
                        >
                            <View
                                style={styles.avatarWrapper}
                            >
                                <Image
                                    source={{uri:item.avatar}}
                                    style={styles.avatar}
                                />
                            </View>
                            <View>
                                <Text
                                    style={styles.name}
                                >{item.name}</Text>
                            </View>
                            <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            style={{backgroundColor:'white'}}
                            onRequestClose={() => {
                            // setModalVisible(!modalVisible);
                            }}
                            >
                            <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Bạn có muốn hủy kết bạn hoặc chặn người này?</Text>
                                <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    style={styles.cancelFriendButton}
                                    onPress={() => {
                                        unFriend(userId,friendId);
                                        setModalVisible(!modalVisible);
                                        setLoading(true)
                                        }}
                                >
                                    <Text style={styles.textStyle}>Hủy kết bạn</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelFriendButton}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setLoading(true)
                                        // Thực hiện hành động khi hủy kết bạn
                                        }}
                                >
                                    <Text style={styles.textStyle}>Chặn</Text>
                                </TouchableOpacity>
                                </View>
                                <TouchableHighlight
                                style={{ ...styles.closeButton }}
                                onPress={() => {
                                    setLoading(true)
                                    setModalVisible(!modalVisible);
                                }}
                                >
                                <Text style={styles.textStyle}>Đóng</Text>
                                </TouchableHighlight>
                            </View>
                            </View>
                        </Modal>

                        </View>
                        
                    <TouchableOpacity 
                    style={{right:10}}
                    onPress={() => {
                        setFriendId(item.idUser);
                    setModalVisible(true);
                    }}>
                        <FontAwesomeIcon icon={faBars} size={25}/>
                        </TouchableOpacity>
                    </View>
                    )}
                    />
                    <Load show={loadingFriend}/>
                </View>  
        </View>
        </Provider>
    )
}
export default FriendList;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    viewRequestUnit: {
        width: '100%',
        height: 'auto',
        borderBottomWidth: 1,
        borderBottomColor: 'grey',
        marginTop: 10,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
    },
    listRequestContainer: {
        width: '95%',
        marginLeft:10,
        borderBottomWidth:1,
        borderColor: 'white',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    avatarWrapper: {
        borderWidth: 1,
        borderRadius: 26,
        width: 52,
        height: 52,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapperAvatarName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        margin: 10,
    },
    message: {
        margin: 10,
        fontSize: 16,
        color: 'black',
        borderTopWidth: 1,
        paddingTop: 10,
    },
    buttonAccept: {
        backgroundColor: '#58A399',
        color: 'white',
        marginRight: 10,
        padding: 5,
        borderRadius: 10,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textButton: {
        color: 'white',
        fontSize: 16,
    },
    buttonDecline: {
        backgroundColor: '#9B3922',
        color: 'white',
        padding: 5,
        borderRadius: 10,
        width: 100,
        marginRight: 10,

    },
    listFriendContainer: {
        width: '95%',
        marginLeft:10
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },
      modalView: {
        
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },
      modalText: {
        marginBottom: 15,
        textAlign: 'center',
      },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
      },
      closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
      },
      textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
      },
      cancelFriendButton: {
        backgroundColor: '#9B3922',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
      },
})