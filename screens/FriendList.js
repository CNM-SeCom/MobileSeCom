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

const FriendList = () => {
    const user = useSelector((state) => state.user.user);
    const [listFriendRequest, setListFriendRequest] = useState('');
    const [listFriend, setListFriend] = useState('');
    const userId = user.idUser;
    const [modalVisible, setModalVisible] = useState(false);
    const cancelRequestAddFriend = (id) => {
        console.log('Hủy yêu cầu' + id)
    }
    const blockFriend = (id) => {
        console.log('Chặn' + id)
    }
    //Danh sach gửi yêu cầu kết bạn
    async function getSentRequestAddFriendByUserId(id) {
        const listFriendRequest = listFriendRequest;
        const data={
            idUser: id,
            listRequest:listFriendRequest
        }
    await axios.post('http://' + ip + ':3000/getSentRequestAddFriendByUserId',data).then((res) => {
        console.log(res.data.data);
        setListFriendRequest(res.data.data);
        return res.data.data;
    }).catch((err) => {
      console.log(err);
    })
    }
    //Danh sách bạn bè
    async function getListFriendByUserId(id) {
        const data={
            idUser: id,
            listFriend:listFriend
        }
        await axios.post('http://' + ip + ':3000/getListFriendByUserId',data).then((res) => {
        setListFriend(res.data.data);
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
        <View style={{backgroundColor:'white'}}>
            <Text style={{justifyContent:'center',alignItems:'center',textAlign:'center',fontSize:20,color:'black'}}>Lời mời kết bạn</Text>
            <FlatList
                contentContainerStyle={{
                    paddingBottom: 20,
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
                                >
                                    <Text
                                        style={styles.textButton}
                                    >Hủy yêu cầu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
            <View>
                <Text style={{justifyContent:'center',alignItems:'center',textAlign:'center',fontSize:20,color:'black'}}>Danh sách bạn bè</Text>
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
                            
                        </View>
                        <Modal
                            animationType="none"
                            transparent={true}
                            visible={modalVisible}
                            style={{backgroundColor:'white'}}
                            onRequestClose={() => {
                            setModalVisible(!modalVisible);
                            }}
                            >
                            <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>Bạn có muốn hủy kết bạn hoặc chặn người này?</Text>
                                <View style={styles.buttonsContainer}>
                                <TouchableOpacity
                                    style={styles.cancelFriendButton}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        // Thực hiện hành động khi hủy kết bạn
                                        }}
                                >
                                    <Text style={styles.textStyle}>Hủy kết bạn</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancelFriendButton}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        // Thực hiện hành động khi hủy kết bạn
                                        }}
                                >
                                    <Text style={styles.textStyle}>Chặn</Text>
                                </TouchableOpacity>
                                </View>
                                <TouchableHighlight
                                style={{ ...styles.closeButton }}
                                onPress={() => {
                                    setModalVisible(!modalVisible);
                                }}
                                >
                                <Text style={styles.textStyle}>Đóng</Text>
                                </TouchableHighlight>
                            </View>
                            </View>
                        </Modal>

                    <TouchableOpacity 
                    style={{right:10}}
                    onPress={() => {
                    setModalVisible(true);
                    }}>
                        <FontAwesomeIcon icon={faBars} size={25}/>
                    </TouchableOpacity>
                    </View>
                    )}
                    />
                    </View>
        </View>
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
        paddingTop: 10,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    listRequestContainer: {
        width: '95%',
        marginLeft:10,
        borderBottomWidth:1
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
        margin: 20,
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
        backgroundColor: 'red',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
      },
})