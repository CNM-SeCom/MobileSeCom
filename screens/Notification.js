import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler'
import { selectUser } from '../slices/userSlice'
import { useState } from 'react'

const Notification = () => {

    const listRequest = [
        {
            id: '1',
            name: 'John Doe',
            avatar: require('../assets/logo1.png'),
            time: '3h ago',
            message: 'Hi there!I am using this app to connect with people. ',
        },
        {
            id: '2',
            name: 'Jane Doe',
            avatar: require('../assets/logo2.png'),
            time: '2h ago',
            message: 'Hello! Make sure to check out my profile and follow me!',
        },
        {
            id: '3',
            name: 'John Smith',
            avatar: require('../assets/logo1.png'),
            time: '1h ago',
            message: 'Message you!',
        },
        {
            id: '4',
            name: 'Jane Smith',
            avatar: require('../assets/logo3.png'),
            time: '1h ago',
            message: 'Sent you a friend request',
        }

    ]

    const handleAccept = (id) => {
        console.log('Accept' + id)
    }

    const handleDecline = (id) => {
        console.log('Decline' + id)
    }

    useEffect(() => {
        console.log('Notification Screen')
    }, [])

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
                                    source={item.avatar}
                                    style={styles.avatar}
                                />
                            </View>
                            <View>
                                <Text
                                    style={styles.name}
                                >{item.name}</Text>
                                <Text>{item.name}</Text>
                            </View>
                        </View>
                        <View>
                            <Text
                                style={styles.message}
                            >{item.message}</Text>
                            <View
                                style={styles.buttonGroup}
                            >
                                <TouchableOpacity
                                    onPress={() => handleAccept(item.id)}
                                    style={styles.buttonAccept}
                                >
                                    <Text
                                        style={styles.textButton}
                                    >Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handleDecline(item.id)}
                                    style={styles.buttonDecline}
                                >
                                    <Text
                                        style={styles.textButton}
                                    >Decline</Text>
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
        width: 70,
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
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
    }
})