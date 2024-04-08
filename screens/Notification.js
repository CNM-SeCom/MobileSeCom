import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import { selectUser } from '../slices/userSlice'
import axios from 'axios';
import ip from '../data/ip';
import { useFocusEffect } from '@react-navigation/native';

const Notification = () => {

  

    const user = useSelector((state) => state.user.user);
    let [listRequest, setListRequest] = useState([]);

   

    const getListRequestAddFriend = async() => {
        console.log('id' , user.idUser);
        await axios.post('http://' + ip + ':3000/getRequestAddFriendByUserId', { idUser : user.idUser })
            .then((response) => {
                // console.log('++++++++++++++++++');
                // console.log(response.data);
                setListRequest(response.data.data);
                return response.data;
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // getListRequestAddFriend();
    // hủy lời mời kết bạn
    async function cancelRequestAddFriend(request) {
        await axios.post('http://' + ip + ':3000/cancelRequestAddFriend',request).then((res) => {
        return res.data.data;
    }).catch((err) => {
      console.log(err);
    })
    }
    // let listRequestAddFriend = getListRequestAddFriend();
    useFocusEffect(
        React.useCallback(() => {
            getListRequestAddFriend();
            console.log('Notification Screen focused');
        }, [])
    );
    console.log('listRequestAddFriend', listRequest);


    const handleAccept = async(item) => {
        console.log(item);
        console.log('==');
        await axios.post('http://' + ip + ':3000/acceptRequestAddFriend',  item )
            .then((response) => {
                console.log(response.data);
                //ẩn item vừa accept
                setListRequest(listRequest.filter((request) => request.id !== item.id));
                return response.data;
            })
    }

    const handleDecline = async(item) => {
        await axios.post('http://' + ip + ':3000/cancelRequestAddFriend',request).then((res) => {
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
                style={styles.listRequestContainer}
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
                                    onPress={() => handleAccept(item)}
                                    style={styles.buttonAccept}
                                >
                                    <Text
                                        style={styles.textButton}
                                    >Xác nhận</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDecline(item.id)}
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
        <View style={styles.container}>
            {renderAddFriendRequest()}
        </View>
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
        width: '95%',

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
        justifyContent: 'flex-end',
        margin: 10,
        marginLeft: 150,
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