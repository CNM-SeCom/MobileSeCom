import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import { selectUser } from '../slices/userSlice'
import axios from 'axios';
import ip from '../data/ip';
import { useFocusEffect } from '@react-navigation/native';
import Load from '../components/Load';
import { Provider} from 'react-native-paper';
import { set } from 'core-js/core/dict'


const Notification = () => {

    const user = useSelector((state) => state.user.user);
    let [listRequest, setListRequest] = useState([]);
    let [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    
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
        getListRequestAddFriend()
      },[user])

    const getListRequestAddFriend = async() => {
        await axios.post('https://' + ip + '/getRequestAddFriendByUserId', { idUser : user.idUser })
            .then((response) => {
                // console.log('++++++++++++++++++');
                // console.log(response.data);
                setListRequest(response.data.data);
                setLoading(false);
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }


    // let listRequestAddFriend = getListRequestAddFriend();
    useFocusEffect(
        React.useCallback(() => {
            setLoading(true);
            getListRequestAddFriend();
            console.log('Notification Screen focused');
        }, [refreshing])
    );

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

    const handleAccept = async(item) => {

        await axios.post('https://' + ip + '/acceptRequestAddFriend',  item )
            .then((response) => {
                console.log(response.data);
                //ẩn item vừa accept
                setLoading(false);
                setRefreshing(!refreshing);
                handleNotify(item.fromUser);
                setListRequest(listRequest.filter((request) => request.id !== item.id));
                return response.data;
            })
    }

    const handleDecline = async(item) => {
        console.log(item);
        const request = item;
        console.log('fromUser', request.fromUser);
        setLoading(true);
        await axios.post('https://' + ip + '/cancelRequestAddFriend',request).then((res) => {
            setLoading(false);
            setRefreshing(!refreshing);
            handleNotify(request.fromUser);
            return res.data.data;
        }).catch((err) => {
          console.log(err);
        })
    }

 

    const renderAddFriendRequest = () => {
        return (
            <FlatList
                contentContainerStyle={{
                    paddingBottom: 20,
                }}
                style={[styles.listRequestContainer,{
                    backgroundColor: colors.background,
                }]}
                data={listRequest}
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
                                    source={{uri:item.avatarFromUser}}
                                    style={styles.avatar}
                                />
                            </View>
                            <View>
                                <Text
                                    style={styles.name}
                                >{item.nameFromUser}</Text>
                                <Text>{item.time}</Text>
                            </View>
                            <View
                                style={styles.buttonGroup}
                            >
                                <TouchableOpacity
                                    onPress={() => 
                                        {
                                            handleAccept(item)
                                           
                                            setLoading(true)
                                        }
                                    }
                                    style={styles.buttonAccept}
                                >
                                    <Text
                                        style={styles.textButton}
                                    >Xác nhận</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        handleDecline(item)
                                        
                                        setLoading(true)
                                    }}
                                    style={styles.buttonDecline}
                                >
                                    <Text
                                        style={styles.textButton}
                                    >Từ chối</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                    </View>
                )}
            />
        )
    }

    return (
        <Provider>
            <View style={styles.container}>
                {renderAddFriendRequest()}
                <Load show={loading} />
            </View>
        </Provider>
    )
}

export default Notification

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
    },
    listRequestContainer: {
        width: '100%',

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
        color: 'white',
    },
    buttonGroup: {
        justifyContent: 'flex-end',
        margin: 10,
        marginLeaft: 100,
        position: 'absolute',
        right: 0,
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
        bottom:10
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
        justifyContent: 'center',
        alignItems: 'center',
    }
})