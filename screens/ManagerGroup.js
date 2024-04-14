import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList,TextInput , ScrollView} from 'react-native'
import React ,{useState} from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useRoute } from '@react-navigation/native'
import { text } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faSearch, faUserXmark } from '@fortawesome/free-solid-svg-icons'
import { Alert } from 'react-native'

const ManagerGroup = () => {
    const route = useRoute().params.params
    console.log('routee', route);
    const [participants, setParticipants] = useState([route.participants])
    
    
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
                    },
                },
            ],
            { cancelable: false }
        );
    };

    

    return (
        <ScrollView 
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
                    style={styles.buttonControl}
                >
                    <Text style={styles.textButton}>
                        Thêm thành viên
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.buttonControl}
                >
                    <Text style={styles.textButton}>
                        Đổi tên nhóm
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonControl]}
                >
                    <Text style={styles.textButton}>
                        Đổi avatar
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonControl]}
                >
                    <Text style={styles.textButton}>
                        Rời nhóm
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.buttonControl, {marginBottom: 10}]}
                >
                    <Text style={styles.textButton}>
                        Giải tán
                    </Text>
                </TouchableOpacity>
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
                                            [{ marginBottom : 10 }, styles.buttonControl] : 
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
                                        
                                    </View>
                                    
                                ))
                            ) : (
                                participants.map((item, index) => (
                                    <View
                                        //nếu index cuối thì thêm marginBottom
                                        style={index === route.participants.length - 1 ? 
                                            [{ marginBottom : 10 }, styles.buttonControl] : 
                                            styles.buttonControl}
                                        key={index}
                                    >
                                        <Image
                                            source={{ uri: item.avatar }}
                                            style={{ width: 40, height: 40, borderRadius: 20 }}
                                        />
                                        <Text style={[styles.textButton, { marginLeft: 10 }]}>{item.name}</Text>
                                        <TouchableOpacity
                                            onPress={() => handlRemoveParticipant(item.idUser)}
                                            style={{ position: 'absolute', right: 10 }}
                                        >
                                            <FontAwesomeIcon icon={faUserXmark} size={20} color='black' />
                                        </TouchableOpacity>
                                        
                                    </View>
                                    
                                ))
                            )
                        }
                   
                    </View>
                </ScrollView>


                    
                </View>
            </View>
        </ScrollView>
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
        height: '100%'
    },
    avatar: {
        width: 100,
        height: 100,
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
    nameWrapper : {
        width: '95%',
        height: 45,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        elevation: 15,        overflow: 'hidden',

    },
    name: {
        fontSize: 20,
        color: 'black',
        alignSelf: 'center',
        fontWeight: 'bold'
    },
    controlwrapper :{
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        elevation: 15,
        overflow: 'hidden',
        
    },
    buttonControl : {
        flexDirection: 'row',
        width: '90%',
        height: 50,
        alignItems: 'center',
        borderBottomColor: 'gray',
        backgroundColor: 'white'  ,
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
    searchWrapper :{
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
    textInputSearch : {
        width: '100%',
        height: 40,
        alignSelf: 'center',
        borderRadius: 10,
        color: 'black',
        paddingLeft: 10,
    },
    iconSearch : {
        width: 30,
        height: 30,
        marginTop: 10,
        position: 'absolute',
        right: 15,
        justifyContent: 'center',
    }
})