import { StyleSheet, Text, View, FlatList,TouchableOpacity, TextInput , Dimensions} from 'react-native'
import React,{ useLayoutEffect, useState }  from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faPen, faMagnifyingGlass, faUser } from '@fortawesome/free-solid-svg-icons';
import ConversationUnit from '../components/ConversationUnit';
import DataUser from '../data/dataUser';
import Avatar from '../components/Avatar';
import DataChat from '../data/dataChat';

import { useSelector } from 'react-redux';

const heigh = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const Chat = ({navigation}) => {

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
  }
  );

  return (
    <View style={[
      {backgroundColor : colors.background},
      styles.container]}>
      <View style={{
          width: '100%',
          height: 50,
          justifyContent: 'center',
          
      }}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="white" style={{
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
            onFocus={() => {
                // setOpacity(1);
            }}
          />
      </View>
      <View style={[
        {backgroundColor : colors.background},
        styles.users]}>
      <FlatList
        data={DataUser}
        showsHorizontalScrollIndicator = {false}
        renderItem={({item}) => (
            <Avatar  />
        )}
        keyExtractor={item => item.userId}
        horizontal={true}
      />
      </View>
      <View style={{
          width: '100%',
          height: heigh * 0.6,
          alignItems: 'center',
      }}>
        <FlatList
          data={DataChat}
          renderItem={({item}) => (
            <ConversationUnit
              name={item.user.name}
              avatar={item.user.avatar}
              newMess={item.text}
            />
          )}
          keyExtractor={item => item._id}
        />
      </View>
    </View>
  )
}

export default Chat

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
      },
    customHeader: {
        height: 50, 
        backgroundColor: '#CC8EE6',
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
      },
})