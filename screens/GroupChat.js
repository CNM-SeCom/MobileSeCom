import { StyleSheet, Text, View, FlatList,TouchableOpacity, TextInput , Dimensions} from 'react-native'
import React,{ useLayoutEffect, useState }  from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import ConversationUnit from '../components/ConversationUnit';
import DataUser from '../data/dataUser';
import DataGroupChat from '../data/dataGroupChat';
import Avatar from '../components/Avatar';
import { useNavigation } from '@react-navigation/native';

import { useSelector } from 'react-redux';

const heigh = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const GroupChat = () => {

const navigation = useNavigation();
const mode = useSelector((state) => state.mode.mode);
const colors = useSelector((state) => {
  switch (mode) {
    case 'dark':
      return state.theme.darkColors;   
    default:
      return state.theme.lightColors;
  }
});

  return (
    <View style={[
      {backgroundColor: colors.background},
      styles.container]}>
    <View style={[
      {backgroundColor: colors.background},
      styles.container]}>
          <View style={{
              width: '100%',
              height: 50,
              justifyContent: 'center',
              
          }}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="#001f3f" style={{
                  position: 'absolute',
                  top: 15,
                  left: 25,
                  zIndex: 1,
              
              }} />
              <TextInput
                style={styles.inputSearch}
                placeholder="Tìm kiếm"
                paddingLeft={40}
                opacity={0.5}
              />
          </View>
          <View style={[
            {backgroundColor: colors.background},
            styles.users]}>
          <FlatList
            data={DataGroupChat}
            showsHorizontalScrollIndicator = {false}
            renderItem={({item}) => (
                <Avatar
                    image={'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg'}
                />
            )}
            keyExtractor={item => item.id}
            horizontal={true}
          />
          </View>
          <View style={{
              width: '100%',
              height: heigh * 0.7,
              alignItems: 'center',
          }}>
            <FlatList
              data={DataGroupChat}
              renderItem={({item}) => (
                <ConversationUnit
                  name={item.name}
                  image={'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg'}
                  newMess={item.lastMessage.message}
                  onPress={()=>{navigation.navigate('ConversationGroup')}}
                />
              )}
              // keyExtractor={item => item.id}
            />
          </View>
        </View>    
    </View>
  )
}

export default GroupChat

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
      },
    customHeader: {
        height: 50, 
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      headerText: {
        color: '#fff', 
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
      },
      iconHeader: {
        color: '#fff', 
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 20,
        alignSelf: 'center',
      },
      iconUser :{
        width: 50,
        height: 50,
        borderRadius: 25,
        marginLeft: 10,
        marginRight: 10,
      },
      users : {
          width: '100%',
          height: 80,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          borderBottomWidth: 1,
          borderBottomColor: '#ccc',
          padding: 5,
      },
      inputSearch :{
        width: '97%',
        height: 40,
        backgroundColor: '#808080',
        padding: 5,
        alignSelf: 'center',
        borderRadius: 30,
        color: '#fff',
        paddingLeft: 50,
      },
})