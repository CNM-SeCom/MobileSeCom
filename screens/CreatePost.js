import { StyleSheet, Text, View, TouchableOpacity, Image, KeyboardAvoidingView, Dimensions,ScrollView } from 'react-native'
import { TextInput } from 'react-native-paper';
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCirclePlus, faArrowAltCircleLeft, faEllipsis, faImages } from '@fortawesome/free-solid-svg-icons';
import KeyboardAccessoryView from 'react-native-ui-lib/lib/components/Keyboard/KeyboardInput/KeyboardAccessoryView';
import { PaperProvider } from 'react-native-paper';
import axios from 'axios';
import ip from '../data/ip';
import RNFetchBlob from 'rn-fetch-blob';
import { launchImageLibrary } from 'react-native-image-picker';
import { forEach } from 'core-js/core/array';

const heigh = Dimensions.get('window').height;


const CreatePost = () => {

    const [content, setContent] = useState('');
    const user = useSelector((state) => state.user.user);
    const mode = useSelector((state) => state.mode.mode);
    const colors = useSelector((state) => {
        switch (mode) {
            case 'dark':
                return state.theme.darkColors;
            default:
                return state.theme.lightColors;
        }
    });

   

    const navigation = useNavigation();
    let images = [];
    let imageUploaded = [];
    const [listImage, setListImage] = useState([]);
    let [visible, setVisible] = useState(false);

    useEffect(() => {
        console.log('nội dung đã thay đổi', content);
    }, [content]);

    useEffect(() => {
        console.log('visible', visible);
    }, [visible]);

    const renderListImage = () => {
        //map listImage để hiển thị ảnh đã chọn
       if(visible === true){
        return (
            listImage.map((item) => {
                return (
                    <Image
                        source={{ uri: item }}
                        style={{ width: 70, height: 70, margin: 5 }}
                    />
                )
            })
           )
       }
       else {
              return null;
       }
    }

    //chọn ảnh
    const selectImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 1,
            //có thể chọn nhiều ảnh
            selectionLimit: 3,
        });

        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.error) {
            console.log('ImagePicker Error: ', result.error);
        } else {
            result.assets.map((item) => {
                images.push(item.uri);
                listImage.push(item.uri);                
                console.log('images', listImage);
            });
        }
    };
    //upload ảnh
    const uploadImage = async (uri) => {

        await RNFetchBlob.fetch('POST', 'http://' + ip + '/uploadImageMessage', {
            'Content-Type': 'multipart/form-data',
        },
            [{ name: 'image', filename: 'image.jpg', type: 'image/jpeg', data: RNFetchBlob.wrap(uri) }
                , { name: 'idUser', data: user.idUser }])
            .then((response) => {
                //format response to json
                response = JSON.parse(response.data);
                imageUploaded.push(response.uri);

                console.log('imageUploaded', imageUploaded);
            }).catch((error) => {
                console.error(error);
            });
    };


    //tạo bài viết
    const createPost = async () => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };
        if (images.length > 0) {
           for (let i = 0; i < images.length; i++) {
                await uploadImage(images[i]);
            }
        }
        const data = {
            title: "test1",
            content: {
                text: content,
                images: imageUploaded,
                video: " "
            },
            likes: [],
            comments: [],
            idUser: user.idUser,
            userCreated : user.name,
        }
        try {
            await axios.post('http://' + ip + ':3003/post/create', data)
                .then(res => {
                    console.log(res.data);
                })
        } catch (error) {
            console.log(error);
        }

        console.log('data', data);
        setContent('');
        imageUploaded = [];
        images = [];
    }

    return (
        <KeyboardAvoidingView
            behavior='height'

            style={{
                flex: 1,
                justifyContent: 'center',
            }}
        >

            <ScrollView
                contentContainerStyle={{
                    backgroundColor: colors.background,
                }}
                style={[styles.container, { backgroundColor: colors.background }]}
            >
                {/* Header */}
                <View
                    style={[styles.header, { backgroundColor: colors.header }]}
                >
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} size={25} color={'white'} style={{ marginLeft: 10, marginTop: 10 }} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontSize: 20, marginLeft: 10, marginTop: 10 }}>Tạo bài viết</Text>
                    <TouchableOpacity
                        onPress={() => {createPost()
                            alert('Đăng bài thành công')
                            navigation.goBack()
                        }}
                        style={styles.postButton}
                    >
                        <Text
                            style={styles.textCreatePost}
                        >
                            Đăng

                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Body */}
                <View>
                    <View
                        style={styles.userDetail}
                    >
                        <View
                            style={styles.avatar}
                        >
                            <Image
                                source={{ uri: user.avatar }}
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                            />
                        </View>
                        <View
                            style={styles.nameView}
                        >
                            <Text
                                style={[styles.name, { color: colors.text }]}
                            >{user.name}</Text>
                        </View>
                        <View
                            style={styles.tagView}
                        >
                            <Text style={styles.tag}>Chỉ mình tôi</Text>

                        </View>
                    </View>

                    <TextInput
                        multiline={true}
                        numberOfLines={12}
                        contentStyle={[styles.input, { backgroundColor: "gray" }]}
                        style={{ backgroundColor: colors.background }}
                        placeholder='Bạn đang nghĩ gì?'
                        // onBlur={(text) => setContent(text)}
                        // onSubmitEditing={(text) => setContent(text)}
                        onChangeText={(text) => setContent(text)}
                    >
                    </TextInput>
                    <View
                        style={{
                            height: 'fit-content',
                            width: '95%',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            alignSelf: 'center',

                        }}
                    >
                    {renderListImage()}
                    </View>
                </View>
                <View
                    style={styles.extensionView}
                >
                    <TouchableOpacity
                        onPress={() => {
                            selectImage()  
                        }}
                        style={styles.buttonExtension}
                    >
                        <Image
                            source={require('../assets/imgp1.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        // onPress={() => setVisible(!visible)}
                        style={styles.buttonExtension}
                    >
                        <Image
                            source={require('../assets/imgp2.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonExtension}
                    >
                        <Image
                            source={require('../assets/imgp3.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonExtension}
                    >
                        <Image
                            source={require('../assets/imgp4.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonExtension}
                    >
                        <Image
                            source={require('../assets/imgp5.png')}
                            style={{ width: 30, height: 30 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonExtension}
                    >
                        <FontAwesomeIcon icon={faEllipsis} size={30} color={'white'} />
                    </TouchableOpacity>
                    
                </View>
                {/* <TouchableOpacity
                        onPress={()=>{
                            setVisible(!visible)
                        }}
                        style={[styles.buttonExtension,
                            {
                                position: 'absolute',
                                top :50,
                                right: 0,
                            }
                        ]}
                    >
                        <FontAwesomeIcon icon={faImages} size={30} color={'white'} />
                    </TouchableOpacity> */}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default CreatePost

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '105%',
    },
    header: {
        width: '95%',
        height: 50,
        flexDirection: 'row',
        alignSelf: 'center',
    },
    postButton: {
        color: 'white',
        fontSize: 20,
        position: 'absolute',
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        top: 5,
    },
    textCreatePost: {
        color: 'white',
        fontSize: 20,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        padding: 3,
        fontWeight: 'bold',
        top: 5,
    },
    userDetail: {
        width: '95%',
        height: 'fit-content',
        flexDirection: 'row',
        borderBottomWidth: 1,
        // borderColor: 'gray',
        //cắt ngăn border 
        overflow: 'hidden',
        alignSelf: 'center',
        marginBottom: 10,
        paddingBottom: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'gray',
        marginLeft: 10,
        marginTop: 10,
    },
    nameView: {
        height: 30,
        marginLeft: 10,
        marginTop: 10,
        paddingHorizontal: 10,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    input: {
        width: '95%',
        height: 450,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    tagView: {
        width: 300,
        height: 30,
        position: 'absolute',
        left: 70,
        top: 40,
        justifyContent: 'center',
    },
    tag: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 5,
        width: 100,
        height: 20,
        textAlign: 'center',
        borderRadius: 2,
        borderWidth: 1,
        // borderColor: 'gray',
    },
    extensionView: {
        width: '95%',
        height: 'auto',
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonExtension: {
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 5,
        marginHorizontal: 8,
        borderWidth: 1,
        borderColor: 'green',
    },
})