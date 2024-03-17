import React, {useState, useEffect} from 'react';
import { Chip } from 'react-native-paper';
import { TextInput, View,TouchableOpacity,StyleSheet, Text,Image } from 'react-native';
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

  const [textSearch, setTextSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  console.log(filteredDataSource);

  function updateSearch(search) {
    setTextSearch(search);
  }
  const config = {
    headers: { Authorization: `Bearer ${token.accessToken}` }
  };
  
  const handleSearch = (textSearch) => {
    console.log("============")
     axios.post('http://192.168.60.78:3000/getListUserByName', {name : textSearch})
      .then((response) => {
        setFilteredDataSource(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  

const handleAddFriend = () => {
  axios.post('http://192.168.60.78:3000/sendRequestAddFriend', { fromUser:"17106455394110348307338",
  toUser:"17106455254400348307336"},config)
  .then((response) => {
    console.log('====================================');
    console.log(response.data);
    console.log('====================================');
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
        onPress={() => navigation.goBack()}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={30} color={colors.text} />
      </TouchableOpacity>
      <TextInput 
        onBlur={() => 
          console.log("onBlur")
        }
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
            source={require('../assets/logo3.png')}
            style={{width : 50, height : 50, borderRadius : 50}}
          />
          <Text
            style={[{color : colors.text},styles.textResult]}
          >{item.name}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleAddFriend()}
          style={[{backgroundColor : colors.background, borderColor : colors.text},styles.buttonAdd]}
        >
          <FontAwesomeIcon icon={faUserPlus} size={30} color={colors.text} />
        </TouchableOpacity>
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