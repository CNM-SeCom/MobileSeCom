import { StyleSheet, Text, View, TouchableOpacity, Image,KeyboardAvoidingView } from 'react-native'
import { TextInput } from 'react-native-paper';
import React, {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCirclePlus, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import KeyboardAccessoryView from 'react-native-ui-lib/lib/components/Keyboard/KeyboardInput/KeyboardAccessoryView';
import {PaperProvider} from 'react-native-paper';

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

    useEffect(() => {
      console.log('nội dung đã thay đổi', content);
    }, [content]);

    const navigation = useNavigation();
  return (
    <KeyboardAvoidingView
        behavior='height'
        
        style={{flex: 1}}
    >
        
    <View
        style={[styles.container,{backgroundColor: colors.background}]}
    >
        {/* Header */}
      <View
        style={[styles.header, {backgroundColor: colors.header}]}
      >
        <TouchableOpacity
            onPress={() => navigation.goBack()}
        >
            <FontAwesomeIcon icon={faArrowAltCircleLeft} size={25} color={'white'} style={{marginLeft: 10, marginTop: 10}} />
        </TouchableOpacity>
        <Text style={{color: 'white', fontSize: 20, marginLeft: 10, marginTop: 10}}>Tạo bài viết</Text>
        <TouchableOpacity
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
                        source={{uri: user.avatar}}
                        style={{width: 50, height: 50, borderRadius: 25}}
                    />
                </View>
                <View
                    style={styles.nameView}
                >
                        <Text
                            style={[styles.name,{color: colors.text}]}
                        >{user.name}</Text>
                </View>
            </View>

            <TextInput
                multiline={true}
                numberOfLines={12}
                contentStyle={[styles.input,{backgroundColor: "gray"}]}
                style={{backgroundColor: colors.background}}
                placeholder='Bạn đang nghĩ gì?'
                // onBlur={(text) => setContent(text)}
                // onSubmitEditing={(text) => setContent(text)}
                onChangeText={(text) => setContent(text)}
            >
            </TextInput>

        </View>
    </View>
    </KeyboardAvoidingView>
  )
}

export default CreatePost

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
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
        top : 5,
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
        height: 70,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: 'gray',
        //cắt ngăn border 
        overflow: 'hidden',
        alignSelf: 'center',
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
        height: 50,
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
        height: 500,
        alignSelf: 'center',
        marginTop: 10,
        marginBottom: 10,
    }
})