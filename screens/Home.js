import { StyleSheet, Text, View, Dimensions, Image, ScrollView } from 'react-native'
import React,{ useLayoutEffect }  from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome, 
         faTv, 
         faComment, 
         faCirclePlus, 
         faMagnifyingGlass ,
         faUserGroup,
         faHeartCrack,
         faBell,
         faBars,
        } from '@fortawesome/free-solid-svg-icons';
import Post from '../components/Post'
import listPost from '../data/ListPost'
import listUser from '../data/List_user'

import { useSelector, useDispatch } from 'react-redux';

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Home = ({ navigation }) => {

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
     
    });
  }, [navigation]);

  return (
    <View style={[
      {backgroundColor : colors.background},
      styles.container]}>
      <View style={styles.scrollContainer}>
            <ScrollView
              lazyLoad={true}
              scrollEventThrottle={90}
              contentContainerStyle={styles.wrapperPost}
            >

              {
                listPost.map((item, index) => (
                  <Post
                  
                    userName={listUser[item.idUser - 1].name}
                    key={index}
                    title={item.title}
                    description={item.description}
                    image={item.image}
                    content={item.content} 
                    />
                ))
              }
            </ScrollView>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
   container: {
       width: width,
       height: height,
       alignItems: 'center',
   },
  
      nav : {
        width: width ,
        height: 50,
        backgroundColor: '#3c3c3c',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        alignSelf: 'center',
      },
      scrollContainer: {
        width: width,
        height: height - 100,
        backgroundColor: '#C4B8E6',
        alignItems: 'center',
      },
      wrapperPost: {
        width: width,
        height: 'fit-content',
        alignItems: 'center',
        backgroundColor: '#18191a',
        paddingBottom: 40,

      },
})