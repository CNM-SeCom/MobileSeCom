import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid, Image, ScrollView, Dimensions } from 'react-native'
import React, { useState, useEffect } from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCamera, faImages } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Modal, Portal, PaperProvider } from 'react-native-paper';
import { useRoute } from '@react-navigation/native'
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios'
import ip from '../data/ip'
import { useSelector, useDispatch } from 'react-redux'
import { setUserAvatar,setUserCover } from '../redux/userSlice'



const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Test = () => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [image, setImage] = useState(null);
  const [imageGallery, setImageGallery] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [visible, setVisible] = useState(false);

  const dataUpdate = {
    avatar: avatar,
    coverImage: coverImage,

  }

  const [savedAvatar, setSavedAvatar] = useState(false);
  const [savedCoverImage, setSavedCoverImage] = useState(false);

  const openCamera = async () => {
    try {
      const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permission Granted');
        const RESULTS = await launchCamera({ mediaType: 'photo', cameraType: 'back' });
        console.log(RESULTS.assets[0].uri);
        setAvatar(RESULTS.assets[0].uri);
      } else {
        console.log('Permission Denied');
      }
    } catch (error) {
      console.log(error);
    }
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
      setAvatar(result.assets[0].uri);
    }
  };
  const uploadImage = (uri) => {
    RNFetchBlob.fetch('POST', 'http://' + ip + ':3000/uploadAvatar', {
      'Content-Type': 'multipart/form-data',
    }, [
      { name: 'image', filename: 'image.jpg', type: 'image/jpeg', data: RNFetchBlob.wrap(uri) }
      ,
      {
        name: 'idUser', data: user.idUser
      }
    ]).then((response) => {
      console.log(response.text());
      dispatch(setUserAvatar(uri));
    }).catch((error) => {
      console.error(error);
    });
  };

  const uploadCoverImage = (uri) => {
    RNFetchBlob.fetch('POST', 'http://' + ip + ':3000/uploadCoverImage', {
      'Content-Type': 'multipart/form-data',
    }, [
      { name: 'image', filename: 'image.jpg', type: 'image/jpeg', data: RNFetchBlob.wrap(uri) }
      ,
      {
        name: 'idUser', data: user.idUser
      }
    ]).then((response) => {
      console.log(response.text());
      dispatch(setUserCover(uri));
    }).catch((error) => {
      console.error(error);
    });
  }

  const selectCoverImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.error) {
      console.log('ImagePicker Error: ', result.error);
    } else {
      setCoverImage(result.assets[0].uri);
    }
  };

  const pickImageWithCamera = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 1,
    });

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.error) {
      console.log('ImagePicker Error: ', result.error);
    } else {
      // Tiếp tục với result.assets[0].uri
      setAvatar(result.assets[0].uri);
    }
  }

  const showImageAvatar = () => {
    if (avatar !== null) {
      return (
        <Image
          source={{ uri: avatar }}
          style={styles.avatar}
        />
      )
    } else {
      return (
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
        />
      )
    }
  }

  const showImageCover = () => {
    if (coverImage !== null) {
      return (
        <Image
          source={{ uri: coverImage }}
          style={styles.coverImage}
        />
      )
    } else {
      return (
        <Image
          source={{ uri: user.coverImage }}
          style={styles.coverImage}
        />
      )
    }
  }

    

  const saveAvatar = () => {
    uploadImage(avatar);
    setSavedAvatar(true);
  }

  const saveCoverImage = () => {
    uploadCoverImage(coverImage);
    setSavedCoverImage(true);
  }

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => {
            navigation.navigate('EditProfile');
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={25} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <Text style={styles.headerTitle}>Thay đổi ảnh</Text>
      ),
    })
  }, [])

  useEffect(() => {
    // Khi savedAvatar thay đổi, component sẽ được kích hoạt lại
  }, [savedAvatar, savedCoverImage, avatar, coverImage, image, imageGallery]);


  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView style={styles.containerScroll}>
          <View style={styles.chooseImageContainer}>
            <View style={styles.chooseAvatarTitleContainer}>
              <Text style={styles.chooseAvatarTitle}>
                Chọn ảnh đại diện
              </Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: 60,
                alignItems: 'center'
              }}>
                <TouchableOpacity
                  onPress={pickImageWithCamera}
                >
                  <FontAwesomeIcon icon={faCamera} size={25} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={selectImage}
                >
                  <FontAwesomeIcon icon={faImages} size={25} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.avatarContainer}>
              {showImageAvatar()}
            </View>
            <View>
              {savedAvatar ? (
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: 'green' }]}
                // onPress={() => navigation.goBack()}
                >
                  <Text style={styles.saveButtonText}>Đã lưu</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  disabled={avatar === null ? true : false}
                  style={[styles.saveButton, { backgroundColor: 'white' }]}
                  // onPress={() => navigation.goBack()}
                  onPress={saveAvatar}
                >
                  <Text style={styles.saveButtonText}>Lưu ảnh đại diện</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View
            style={styles.chooseImageContainer}
          >
            <View
              style={styles.chooseAvatarTitleContainer}
            >
              <Text style={styles.chooseAvatarTitle}>
                Chọn ảnh bìa
              </Text>
              <TouchableOpacity
                onPress={selectCoverImage}
              >
                <FontAwesomeIcon icon={faImages} size={25} color="black" />
              </TouchableOpacity>
            </View>
            <View
              style={styles.chooseCoverImageContainer}
            >
              {showImageCover()}
            </View>
            {savedCoverImage ? (
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: 'green' }]}
              >
                <Text style={styles.saveButtonText}>Đã lưu</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={coverImage === null ? true : false}
                style={[styles.saveButton, { backgroundColor: 'white' }]}
                onPress={saveCoverImage}
              >
                <Text style={styles.saveButtonText}>Lưu lại ảnh bìa</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </PaperProvider>
  )
}

export default Test

const styles = StyleSheet.create({
  container: {
    width: width,
    height: '100%',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  containerScroll: {
    width: '100%',
    height: '100%',
  },
  chooseImageContainer: {
    width: '98%',
    height: 'auto',
    backgroundColor: '#808080',
    alignSelf: 'center',
    marginTop: 5,
    paddingBottom: 10
  },
  chooseAvatarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    margin: 5
  },
  chooseAvatarTitleContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: '98%',
    height: 'auto',
    alignSelf: 'center',
    paddingTop: 10,
  },
  avatar: {
    width: 280,
    height: 280,
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 140,
    borderWidth: 5,
    borderColor: 'black',
  },
  saveButton: {
    width: '80%',
    height: 50,
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    marginVertical: 10,
    elevation: 5
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chooseCoverImageContainer: {
    width: '98%',
    height: 300,
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black'
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 20,
  },
  buttonInModal: {
    width: 130,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
})