import React, {useState, useEffect} from 'react';
import { Chip } from 'react-native-paper';
import { TextInput, View,TouchableOpacity,StyleSheet, Text,Image, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faArrowLeft, faSearch, faUserPlus} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native'; 
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import axios from 'axios';
import ip from '../data/ip';
import token from '../redux/tokenSlice';

import { FlatList } from 'react-native-gesture-handler';
import DataUser from '../data/dataUser';
const Search = () => {
  const token = useSelector((state) => state.token.token);
  const mode = useSelector((state) => state.mode.mode);
  const user = useSelector((state) => state.user.user);

  console.log('user', user.listFriend);
  
  const colors = useSelector((state) => {
    switch (mode) {
      case 'dark':
        return state.theme.darkColors;   
      default:
        return state.theme.lightColors;
    }
  });


  const [textSearch, setTextSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  console.log(filteredDataSource);

  function updateSearch(search) {
    setTextSearch(search);
  }
  const config = {
    headers: { Authorization: `Bearer ${token.accessToken}` }
  };
  
  const handleSearch = async(textSearch) => {
    console.log("============")
    await axios.post('http://'+ip+':3000/getListUserByName', {name : textSearch, idUser : user.idUser},config)
      .then((response) => {
        setFilteredDataSource(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  

const renderButtonAdd = (idUser, name) => {

  checkFriend(idUser);
   if(checkFriend(idUser) == true){
    return(
      <TouchableOpacity
        onPress={() => {
          handleAddFriend(idUser)
          Alert.alert('Thông báo', 'Đã gửi lời mời kết bạn đến '+name);
        }}
        style={[{backgroundColor : colors.background, borderColor : colors.text},styles.buttonAdd]}
      >
        <FontAwesomeIcon icon={faUserPlus} size={30} color={colors.text} />
      </TouchableOpacity>
    );
  }
}

  
const checkFriend = (item) => {
  for (const friend of user.listFriend) {
    if (friend.idUser === item) {
      return false; // Nếu tìm thấy idUser trong listFriend thì trả về false
    }
  }
  return true; // Nếu không tìm thấy idUser trong listFriend thì trả về true
};


const handleNotify = (receiverId, name) => {
  const data = {
    receiverId: receiverId,
    name : name
  }

  axios.post('http://'+ip+':3000/ws/sendNotifyAddFriendToUser', {data})
  .then((response) => {
    
    console.log(response.data);
  })

}


const handleAddFriend = async(toIdUser, nameToUser, avatar) => {
  const data ={
    fromUser:user.idUser,
    nameFromUser:user.name,
    avatarFromUser:user.avatar,
    toUser:toIdUser,
    nameToUser : nameToUser, 
    avatarToUser : avatar,

  }

  

  await axios.post('http://'+ip+':3000/sendRequestAddFriend', data,config)
  .then((response) => {
    handleNotify(toIdUser, data.nameFromUser);
   console.log('==================');
    console.log(response.data);
  })
  .catch((error) => {
    console.log(error);
  }
);
}

const navigation = useNavigation();
return (
  <View style={[{backgroundColor : colors.background},styles.container]}>
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={30} color={colors.text} />
      </TouchableOpacity>
      <TextInput 
        placeholder="Tìm kiếm..."
        onChangeText={(search) => {
          updateSearch(search);
        }}
        style={[{borderColor : colors.text,},styles.textInput]}>
      </TextInput>
      <TouchableOpacity
        onPress={() => handleSearch(textSearch)}
        style={styles.buttonAdd}
      >
        <FontAwesomeIcon icon={faSearch} size={30} color={colors.text} />
      </TouchableOpacity>
    </View>
    <FlatList
      style={styles.wrapperDataSearch}
      data={filteredDataSource}
      renderItem={({item}) => (
       <View 
        style={{flexDirection : 'row', justifyContent : 'space-between',  width : '100%'}} 
       >
         <TouchableOpacity
          style={[{backgroundColor : colors.background, borderColor : colors.text},styles.elementResult]}
        >
          <View 
            style={{flexDirection : 'row', alignItems : 'center'}}
          >
          <Image
            source={{uri : item.avatar}}
            style={{width : 50, height : 50, borderRadius : 50}}
          />
          <Text
            style={[{color : colors.text},styles.textResult]}
          >{item.name}</Text>
          </View>
        </TouchableOpacity>
        {/* <TouchableOpacity
          onPress={() => {
            handleAddFriend(item.idUser, item.name, item.avatar)
            Alert.alert('Thông báo', 'Đã gửi lời mời kết bạn đến '+item.name);
          }}
          style={[{backgroundColor : colors.background, borderColor : colors.text},styles.buttonAdd]}
        >
          <FontAwesomeIcon icon={faUserPlus} size={30} color={colors.text} />
        </TouchableOpacity> */}
        {renderButtonAdd(item.idUser, item.name)}
       </View>
      )}
    />
  </View>
);
}
export default Search;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  chip : {
    margin : 4,
  },
  textInput : {
    width : '90%' ,
    height : 40,
    backgroundColor : 'white',
    borderRadius : 10,
    marginTop : 10,
    marginBottom : 10,
    paddingLeft : 10,
    opacity : 0.7,
    borderWidth : 3,
  },
  headerContainer : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignItems: 'center',
  },
  wrapperDataSearch :{
    width : '100%',
    paddingVertical : 0,
  },
  elementResult :{
    marginBottom : 5,
    marginTop : 1,
    width : '100%',
    height : 60,
    alignSelf : 'center',
    borderRadius : 10,
    flexDirection : 'row',
    alignItems : 'center',
    borderBottomWidth : 1,
    paddingLeft : 10,
  },
  textResult :{
    fontSize : 18,
    marginLeft : 10,
    fontWeight : 'bold',
  },
  buttonAdd :{
    width : 50,
    height : 60,
    right : 55,
    justifyContent : 'center',
    alignItems : 'center',
  },
});