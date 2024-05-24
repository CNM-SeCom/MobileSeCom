import { StyleSheet, Text, View, TouchableOpacity, Dimensions, Image,ScrollView, TextInput } from 'react-native'
import React, {useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, faGraduationCap, faHeart, faBriefcase, faArrowAltCircleLeft, faPen, faRotateLeft} from '@fortawesome/free-solid-svg-icons';
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import ip from '../data/ip';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const UpdateInfo = (  ) => {

  const user = useSelector((state) => state.user.user);
  const route = useRoute().params;

  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [userName, setUserName] = useState('');
  const [dob, setDob] = useState('');
  const [biography, setBiography] = useState('');
  const [address, setAddress] = useState('');
  const [school, setSchool] = useState('');
  const [relationship, setRelationship] = useState('');
  const [job, setJob] = useState('');
  const [link, setLink] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const idUser = user.idUser;

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };
 
  

  // const dataUpdate = useRoute().params;
  // //khi focus vào màn hình này thì log ra dataUpdate
  // useEffect(() => {
  //   if(dataUpdate) {
  //     setAvatar(dataUpdate.dataUpdate.avatar);
  //     setCoverImage(dataUpdate.dataUpdate.coverImage);
  //   }
  // }, [dataUpdate, avatar,coverImage, userName, biography, address, school, relationship, job, link]);
 

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

  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
 
  const handleEditName = (userName) => {
  const regexName = /\b[A-Z]\w*/;

    const newName = userName;
    const idUser = user.idUser;
    const data = {
      idUser: idUser,
      newName: newName,
    }
    const params = {
      idUser: idUser,
      name: newName,
  };
  if (!regexName.test(newName)) {
    alert('Chữ cái đầu phải viết hoa');
  } else {
    axios.post('http://' + ip + '/changeProfile',params).then((res) => {
      
    alert('Cập nhật tên thành công');
    navigation.goBack();

    }).catch((err) => {
      console.log(err);
    })
    console.log(newName);
    console.log(idUser);
  }
    
  }


  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: 'Chỉnh sửa trang cá nhân',
      headerTitleAlign: 'flex-start',
      headerTitleStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
      },
      headerStyle: {
        backgroundColor: '#3c3c3c',
        shadowColor: '#fff',
        elevation: 0,
      },
      headerLeft: () => {
        return (
          <View>
            <TouchableOpacity
              style={{marginLeft: 10}}
              onPress={() => {
                navigation.goBack();
              }}>
              <FontAwesomeIcon icon={faArrowAltCircleLeft} size={25} color={'#fff'} />
            </TouchableOpacity>
          </View>
        )
      },
    });
  }, [navigation])

  return (
    <PaperProvider 
    style={styles.container}>
      <ScrollView 
      lazyLoad={true}
      scrollEnabled={true}
      scrollEventThrottle={90}
      contentContainerStyle={styles.wrapper}
      style={{
         width: width,
         height: height,
         backgroundColor: '#3c3c3c',
      }}>     
      <View style={styles.editAvatarContainer}>
        <View style={styles.editTitle}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 15,
            }}
          >Chỉnh sửa ảnh</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChooseImage');
            }}
          >
            <FontAwesomeIcon icon={faPen} size={20} color={'#fff'} style={{marginLeft : 10, top : 4}}/>
          </TouchableOpacity>
        </View>
       {
          avatar != '' ?
          <Image
            style={styles.avatar} 
            source={{uri: avatar}}
          />
        :
        <Image
          style={styles.avatar} 
          source={{uri: user.avatar}}
        />
       }
        </View>
      {/* CoverImage */}
      <View style={styles.coverImageContainer}>
        <View style={styles.editTitle}>
        </View>
          {
             coverImage != '' ?
            <Image
              style={styles.coverImage} 
              source={{uri: coverImage}}
            />
            :
            <Image
              style={styles.coverImage} 
              source={{uri: user.coverImage}}
            />
          }
      </View>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          color: '#fff',
          fontSize: 25,
          marginLeft: 5,
          marginTop: 5,
          alignSelf: 'center',
          fontWeight: 'bold',
          borderBottomWidth:1,borderColor:'white'
        }}>Họ và tên:
         {/* nếu user name là khoảng trắng hoặc rỗng thì hiện tên user.name */}
         {
            userName ? 
              (userName === ' ' || userName === '' ? user.name : userName) :
              user.name
          }

        </Text>
        <TouchableOpacity
          onPress={() => {
            toggleModal();
          }}
        >
          <FontAwesomeIcon icon={faPen} size={20} color={'#fff'} style={{marginLeft : 10, top : 4}}/>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setUserName('');
          }}
        >
          <FontAwesomeIcon icon={faRotateLeft} size={20} color={'#fff'} style={{marginLeft : 10, top : 4}}/>
        </TouchableOpacity>
      </View>
      <View style={styles.biographyContainer}>
        <View style={styles.editTitle}>
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 15,
            }}
          >Tiểu sử</Text>
          <TouchableOpacity
            onPress={showModal}
          >
            <Text style={{
                color: '#55c1dd',
                fontWeight: 'bold',
              fontSize: 15,
            }}>Thêm</Text>
          </TouchableOpacity>
          
          </View>
          {
            biography ?
            <Text style={{
              color: '#fff',
              fontSize: 15,
              marginLeft: 5,
              marginTop: 5,
              alignSelf: 'center',
              height: 'fit-content',
            }}>{biography}</Text>:
            <Text style={{
              color: '#fff',
              fontSize: 15,
              marginLeft: 5,
              marginTop: 5,
              alignSelf: 'center',
              height: 'fit-content',
            }}>Mô tả bản thân</Text>

          }
      </View>
      <View style={styles.detailContainer}>
          <View style={styles.editTitle}>
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                fontSize: 15,
              }}
            >Chi tiết</Text>
            <TouchableOpacity>
              <Text style={{
                color: '#55c1dd',
                fontWeight: 'bold',
                fontSize: 15,
              }}>Thêm</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailUnit}>
              <FontAwesomeIcon icon={faHome} size={25} color={'#fff'} />
              <Text style={{
                color: '#fff',
                fontSize: 15,
                marginLeft: 10,
              }}>Đang sống tại Bình Dương</Text>
          </View>
          <View style={styles.detailUnit}>
              <FontAwesomeIcon icon={faGraduationCap} size={25} color={'#fff'} />
              <Text style={{
                color: '#fff',
                fontSize: 15,
                marginLeft: 10,
              }}>Đang học IUH </Text>
          </View>
          <View style={styles.detailUnit}>
              <FontAwesomeIcon icon={faHeart} size={25} color={'#fff'} />
              <Text style={{
                color: '#fff',
                fontSize: 15,
                marginLeft: 10,
              }}>Đang ...</Text>
          </View>
          <View style={styles.detailUnit}>
              <FontAwesomeIcon icon={faBriefcase} size={25} color={'#fff'} />
              <Text style={{
                color: '#fff',
                fontSize: 15,
                marginLeft: 10,
              }}>Đang ...</Text>
          </View>
         <View style={styles.linkContainer}>
              <View style={styles.editTitle}>
                <Text
                  style={{
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: 15,
                  }}
                >Liên kết</Text>
                <TouchableOpacity>
                  <Text style={{
                color: '#55c1dd',
                fontWeight: 'bold',
                    fontSize: 15,
                  }}>Thêm</Text>
                </TouchableOpacity>

              </View>
              <Text style={{
                color: '#fff',
                fontSize: 15,
                marginLeft: 5,
                marginTop: 5,
                height: 'fit-content',
              }}>Liên kết đến các trang web khác của bạn</Text>
         </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          handleEditName(userName);
        }}
        style={styles.saveButton}
      >
        <Text style={{
          color: '#fff',
          fontSize: 15,
          fontWeight: 'bold',
        }}>Lưu</Text>
      </TouchableOpacity>
      </ScrollView>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modal}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 15,
              padding: 10,
            }}
          >Thêm tiểu sử</Text>
          <TextInput
            multiline={true}
            numberOfLines={10}
            maxLength={200}
            onChangeText={(text) => {
              setBiography(text);
              }
            }
            style={styles.inputBio}
          >
          </TextInput>
          <TouchableOpacity
            onPress={
              hideModal              
            }
            style={styles.saveNewName}
          >
            <Text style={{
              color: '#55c1dd',
              fontWeight: 'bold',
              fontSize: 15,
              alignSelf: 'center',
            }}>OK</Text>
          </TouchableOpacity>
        </Modal>
      {/* sửa tên người dùng */}
        <Modal visible={isModalVisible} onDismiss={toggleModal} contentContainerStyle={styles.modalIputNewName}>
          <Text
            style={{
              color: '#000',
              fontWeight: 'bold',
              fontSize: 17,
              padding: 10,
              alignSelf: 'center',
            }}
          >Nhập tên mới</Text>
          <TextInput
            multiline={true}
            numberOfLines={1}
            maxLength={20}
            onChangeText={(text) => {
              setUserName(text);
              console.log(userName);
              }
            }
            {
              ...userName ? 
              {defaultValue: userName} : {defaultValue: ' '+user.name}
            }
            onFocus={() => {
              setUserName('');
            }}
            style={styles.inputNewName}
          >
          </TextInput>
          <TouchableOpacity
            onPress={() => {
              toggleModal();
              //nếu người dùng không nhập lại tên thì set lại tên cũ
            }}
            style={styles.saveNewName}
          >
            <Text style={{
              color: '#55c1dd',
              fontWeight: 'bold',
              fontSize: 15,
              alignSelf: 'center',
            }}>OK</Text>
          </TouchableOpacity>
        </Modal>
        
      </Portal>
    </PaperProvider>
  )
}

export default UpdateInfo

const styles = StyleSheet.create({
    container: {
      width: width,
      height: height,
      alignItems: 'center',
      backgroundColor: '#3c3c3c',
      alignItems: 'center',
      paddingBottom: 40,
    }, 
    editAvatarContainer :{
        width: width * 0.95,
        height: 200,
        flexDirection: 'row',
        borderColor: '#fff',
        backgroundColor: '#3c3c3c',
        justifyContent: 'center',
        alignSelf: 'center',
    }, 
    editTitle :{
        fontSize: 15,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 5,
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    avatar :{
        width: 150,
        height: 150,
        borderRadius: 75,
        marginLeft: 5,
        marginTop: 5,
        position: 'absolute',
        alignSelf: 'center',
        borderWidth: 5,
        borderColor: '#fff',

    },
    coverImageContainer :{
        width: width * 0.95,
        height: 'fit-content',
        marginTop: 20,
        borderColor: '#fff',
        borderBottomWidth: 1,
        backgroundColor: '#3c3c3c',
        paddingBottom: 10,
        alignSelf: 'center',

    },
    coverImage :{
        width: '100%',
        height: 200,
        backgroundColor: 'gray',
        marginTop: 5,
        borderRadius: 25,
    },
    biographyContainer :{
        width: width * 0.95,
        height: 'fit-content',
        marginTop: 20,
        borderColor: '#fff',
        borderBottomWidth: 1,
        backgroundColor: '#3c3c3c',
        paddingBottom: 10,
        alignSelf: 'center',

    },
    detailContainer :{
        width: width * 0.95,
        height: 'fit-content',
        marginTop: 20,
        borderColor: '#fff',
        borderBottomWidth: 1,
        backgroundColor: '#3c3c3c',
        paddingBottom: 10,
        alignSelf: 'center',

    }, 
    detailUnit : {
        width: '100%',
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    wrapper: {
      width: width,
      height: 'fit-content',
      alignItems: 'center',
      paddingBottom: 40,
    },
    linkContainer : {
      width: '100%',
      height: 50,
    },
    saveButton : {
      width: '95%',
      height: 40,
      backgroundColor: '#8ac8d8',
      borderRadius: 5,
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: 20,
      justifyContent: 'center',
    },
    modal: {
      width: '95%',
      height: 300,
      alignSelf: 'center',
      backgroundColor: 'white',
      justifyContent: 'flex-start',
  },
  inputBio :{
      width: '95%',
      height: 200,
      backgroundColor: '#add8e6',
      alignSelf: 'center',
      borderRadius: 5,
      textAlignVertical: 'top',
      borderRadius: 15,
      padding: 10,
  },
  modalIputNewName :{
    width: '95%',
    height: 150,
    alignSelf: 'center',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
    borderRadius: 15,
    paddingBottom: 20,
  },
  inputNewName :{
    width: '95%',
    height: 50,
    backgroundColor: '#add8e6',
    alignSelf: 'center',
    borderRadius: 5,
    borderRadius: 15,
    paddingLeft: 10,
    fontSize: 15,
    fontWeight: 'bold',
  },
  saveNewName :{
    width: '95%',
    height: 40,
    // backgroundColor: '#8ac8d8',
    backgroundColor: '#fff',
    borderRadius: 15,
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
    borderColor: '#55c1dd',
    borderWidth: 3,
    justifyContent: 'center',
  }
})