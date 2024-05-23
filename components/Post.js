import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import Video from 'react-native-video'
import LinearGradient from 'react-native-linear-gradient';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faComment, faShare, faThumbsUp, faHeart } from '@fortawesome/free-solid-svg-icons';
import ip from '../data/ip';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Imagee from './Image';
import { useNavigation } from '@react-navigation/native';

import { useSelector } from 'react-redux';

const Post = (props) => {

  const user = useSelector((state) => state.user.user);
  const navigation = useNavigation();

  const mode = useSelector((state) => state.mode.mode);
  const colors = useSelector((state) => {
    switch (mode) {
      case 'dark':
        return state.theme.darkColors;
      case 'light':
        return state.theme.lightColors;
      default:
        return state.theme.defaultColors;
    }
  });

  const { title, description, image, content, userName, likes, comments, idUser, idPost } = props;

  let [show, setShow] = useState(false);
  let [imageShow, setImageShow] = useState([]);
 //hiển thị ảnh phóng to lên modal

  //layout cho ảnh
  const renderImage = (images) => {
    // Kiểm tra nếu đối tượng images tồn tại và có thuộc tính uri
    if (images && images.uri && Array.isArray(images.uri)) {
      // nếu có 2 ảnh
      if (images.uri.length === 2) {
        return (
          <View style={[styles.viewIamge, {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }]}>
            {images.uri.map((uri, index) => (
              <TouchableOpacity
                style={{
                  width: '48%',
                  height: 'fit-content',
                  marginBottom: 10,
                  overflow: 'hidden',
                  backgroundColor: 'gray',
                  borderRadius: 10,
                }}
                key={index}
                onPress={() => {
                  setShow(true);
                  setImageShow(uri);
                }}
              >
                <Image
                  style={[styles.image, {
                    width: '100%',
                    height: 200,
                    backgroundColor: 'red',
                  }]}
                  source={{ uri: uri }}
                  resizeMode='cover'
                />
              </TouchableOpacity>
            ))}
          </View>
        );
      } else if (images.uri.length > 2) {
        return (
          <View style={[styles.viewIamge, {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }]}>
            {images.uri.slice(0, 3).map((uri, index) => (
              <View
                key={index}
                style={{
                  width: '48%',
                  height: 200,
                  marginBottom: 10,
                  overflow: 'hidden',
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: 'gray',
                    borderRadius: 10,
                    overflow: 'hidden',
                    height: '100%',
                  }}
                  onPress={() => {
                    setShow(true);
                    setImageShow(uri);
                  }}
                >
                  <Image
                    style={[styles.image, {
                      width: '100%',
                      height: 200,
                    }]}
                    source={{ uri: uri }}
                    resizeMode='cover'
                  />
                </TouchableOpacity>
              </View>
            ))}
            {/* nút còn nữa */}
            <TouchableOpacity
              style={[styles.image, {
                width: '48%',
                height: 200,
                marginBottom: 10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 10,
                backgroundColor: 'gray',
              }]}
              onPress={() => {
                // handle more images action
              }}
            >
              <Text style={{ color: 'white', fontSize: 18 }}>
                +{images.uri.length - 3}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else if (images.uri.length === 1) {
        return (
          <View style={styles.viewIamge}>
            <TouchableOpacity
              style={{
                width: '100%',
                height: 300,
                overflow: 'hidden',
                backgroundColor: 'gray',
                borderRadius: 10,
              }}
              onPress={() => {
                setShow(true);
                setImageShow(images.uri[0]);
              }}
            >
              <Image
                style={styles.image}
                source={{ uri: images.uri[0] }}
                resizeMode='cover'
              />
            </TouchableOpacity>
          </View>
        );
      }
    }
    return null; // Trả về null nếu không có images hoặc images không hợp lệ
  };
  
  const likePost = async () => {
    try {
      console.log('idPost', idPost);
      console.log('idUser', idUser);
      await axios.post('http://'+ip+':3003/post/like', {
        id: idPost,
        userId: idUser,
      })
        .then((response) => {
          //gửi tín hiệu cho màn hình Home.js để load lại dữ liệu
        });
      
    } catch (error) {
      console.log(error);
    }
  }
 
  const getPosts = async () => {
    try {
      await axios.get('http://' + ip + ':3003/post/findAll')
        .then(res => {
        })
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View
      style={[
        { backgroundColor: colors.background },
        styles.background]}>
      <View style={[
        { backgroundColor: colors.card },
        styles.container]}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={[
            { color: colors.text },
            styles.userName]}>{userName}</Text>
          <Text style={[
            { color: colors.text },
            { marginRight: 10 }]}>{description}</Text>
        </View>
        <Text style={[
          { color: colors.text },
          styles.content]}>{content}</Text>
        {
          renderImage(image)
        }
        <View style={styles.status}>
          <View style={styles.unitStatus}>
            <FontAwesomeIcon icon={faThumbsUp} size={20} color="#808080" />
            <Text style={[
              { color: colors.text },
              styles.unitStatusText]}>
              {likes?.length} Likes
            </Text>
          </View>
          <View style={styles.unitStatus}>
            <Text style={[
              { color: colors.text },
              styles.unitStatusText]}>{comments?.length} Comments</Text>
          </View>
        </View>
        <View style={styles.operation}>
          <TouchableOpacity
            onPress={() => likePost()}
          >
            <View style={styles.unitStatus}>
              <FontAwesomeIcon icon={faThumbsUp} size={25} 
                // color="#808080" 
                //nếu user.idUser = idUser thì màu xanh
                //nếu không thì màu đỏ
                color={(
                  props.likes ?
                    props.likes.find((like) => like.userId === user.idUser) ?
                      'blue' : '#808080'
                    : '#808080'
                  ) 
                 }
                    
              />
              <Text style={[
                { color: colors.text },
                styles.unitStatusText]}>Like</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
          >
            <View style={styles.unitStatus}>
              <FontAwesomeIcon icon={faComment} size={25} color="#808080" />
              <Text style={[
                { color: colors.text },
                styles.unitStatusText]}>Comments</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.unitStatus}>
              <FontAwesomeIcon icon={faShare} size={25} color="#808080" />
              <Text style={[
                { color: colors.text },
                styles.unitStatusText]}>Share</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Imagee show={show} 
        uri={imageShow}
        close={
          () => setShow(false)}
          />
      </View>
    </View>
  )
}

export default Post

const styles = StyleSheet.create({
  background: {
    // backgroundColor : 'black',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    borderBottomWidth: 1,

  },
  container: {
    width: '95%',
    height: 'fit-content',
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 10,
    borderWidth: 1,
    elevation: 7,
    shadowColor: 'black',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    // color : '#C0C0C0',
    marginHorizontal: 10,
  },
  content: {
    fontSize: 15,
    // color : '#C0C0C0',
    marginHorizontal: 10,
    marginBottom: 10,
    // backgroundColor : 'red',
    paddingVertical: 10,
    paddingLeft: 10,
    borderLeftWidth: 5,
    borderColor: 'gray',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 300,
    alignSelf: 'center',
    resizeMode: 'center',
    borderWidth: 1,
   
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    // color: 'white',
    backgroundColor: 'transparent',
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 10,
    // borderColor : 'gray',
  },
  operation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  unitStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unitStatusText: {
    marginLeft: 5,
    // color : '#C0C0C0',
  },
  viewIamge:{
    width: '95%',
    height: 'fit-content',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    overflow: 'hidden',
    padding: 10,
    margin: 10,
   
  }
})