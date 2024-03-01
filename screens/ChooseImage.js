import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid, Image, ScrollView, Dimensions } from 'react-native'
import React, {useState,useEffect} from 'react'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCamera, faImages } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Modal, Portal, PaperProvider } from 'react-native-paper';


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Test = () => {

const navigation = useNavigation();

const [image, setImage] = useState(null);
const [imageGallery, setImageGallery] = useState(null);
const [avatar, setAvatar] = useState(null);
const [coverImage, setCoverImage] = useState(null);
const [visible, setVisible] = useState(false);

const [savedAvatar, setSavedAvatar] = useState(false);
const [savedCoverImage, setSavedCoverImage] = useState(false);

    const openCamera = async () => {
      try {
        const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
        if(checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission Granted');
          const RESULTS = await launchCamera({mediaType : 'photo', cameraType : 'back'});
          console.log(RESULTS.assets[0].uri);
          setAvatar(RESULTS.assets[0].uri);
        }else {
          console.log('Permission Denied');
        }
      } catch (error) {
          console.log(error);
      }
    }

    const openGalleryAvatar = async () => {
      try {
        const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if(checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission Granted');
          const RESULTS = await launchImageLibrary({mediaType : 'photo'});
          console.log(RESULTS.assets[0].uri);
          setAvatar(RESULTS.assets[0].uri);
        }else {
          console.log('Permission Denied');
        }
      } catch (error) {
          console.log(error);
      }
    }

    const openGalleryCover = async () => {
      try {
        const checkPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        if(checkPermission === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission Granted');
          const RESULTS = await launchImageLibrary({mediaType : 'photo'});
          console.log(RESULTS.assets[0].uri);
          setCoverImage(RESULTS.assets[0].uri);
        }else {
          console.log('Permission Denied');
        }
      } catch (error) {
          console.log(error);
      }
    }


    const showImageAvatar = () => {
      if(avatar !== null) {
        return (
          <Image
            source={{uri: avatar}}
            style={styles.avatar}
          />
        )
      }else
      {
        return (
          <View style={styles.avatar}></View>
        )
      }
    }

    const showImageCover = () => {
      if(coverImage !== null) {
        return (
          <Image
            source={{uri: coverImage}}
            style={styles.coverImage}
          />
        )
      }else
      {
        return (
          <View style={styles.coverImage}></View>
        )
      }
    }

    const saveAvatar = () => {
      setSavedAvatar(true);
    }

    const saveCoverImage = () => {
      setSavedCoverImage(true);
    }

    useEffect(() => {
      navigation.setOptions({
        headerShown: true,
        headerLeft: () => (
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => {
              showModal();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={25} color="black"/>
          </TouchableOpacity>
        ),
        headerTitle: () => (
          <Text style={styles.headerTitle}>Choose Image</Text>
        ),
      })
    }, [])

    useEffect(() => {
      // Khi savedAvatar thay đổi, component sẽ được kích hoạt lại
    }, [savedAvatar, savedCoverImage, avatar, coverImage, image, imageGallery]);
    
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

  return (
    <PaperProvider>
      <View style={styles.container}>
     <ScrollView style={styles.containerScroll}>
      <View style={styles.chooseImageContainer}>
        <View style={styles.chooseAvatarTitleContainer}>
          <Text style={styles.chooseAvatarTitle}>
              Choose Avatar
          </Text>
         <View style={{
            flexDirection : 'row',
            justifyContent : 'space-between',
            width : 60,
            alignItems : 'center'
         }}>
         <TouchableOpacity
            onPress={openCamera}
          >
            <FontAwesomeIcon icon={faCamera} size={25} color="black"/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openGalleryAvatar}
          >
            <FontAwesomeIcon icon={faImages} size={25} color="black"/>
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
                <Text style={styles.saveButtonText}>Saved</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: 'white' }]}
                // onPress={() => navigation.goBack()}
                onPress={saveAvatar}
              >
                <Text style={styles.saveButtonText}>Save your avatar</Text>
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
              Choose Cover Image
            </Text>
            <TouchableOpacity
              onPress={openGalleryCover}
            >
              <FontAwesomeIcon icon={faImages} size={25} color="black"/>
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
                <Text style={styles.saveButtonText}>Saved</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: 'white' }]}
                onPress={saveCoverImage}
              >
                <Text style={styles.saveButtonText}>Save your cover</Text>
              </TouchableOpacity>
            )}
        </View>
     </ScrollView>
    </View>

      <Portal>
        <Modal
          visible={visible} onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
          <TouchableOpacity
            style={[
            { backgroundColor: '#74c69d'},
            styles.buttonInModal]}            
            onPress={() => {
              hideModal();
              navigation.goBack();
            }}          
          >
            <Text>Save and close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              { backgroundColor: '#6a040f'},
              styles.buttonInModal]}
            onPress={() => {
              hideModal();
            }}          
          >
            <Text
              style={{
                color: 'white',
              }}
            >Continue</Text>
          </TouchableOpacity>
          </View>
        </Modal>
      </Portal>

    </PaperProvider>
  )
}

export default Test

const styles = StyleSheet.create({
  container: {
    width : width,
    height : '100%',
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
    margin : 5
  },
  chooseAvatarTitleContainer: {
    width :'100%', 
    flexDirection : 'row', 
    justifyContent : 'space-between', 
    alignItems : 'center', 
    padding : 5,
    borderBottomWidth: 1,
  },  
  avatarContainer : {
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
  saveButton : {
    width: '80%',
    height: 50,
    // backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 20,
    marginVertical: 10,
    elevation : 5
  },
  saveButtonText : {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chooseCoverImageContainer : {
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