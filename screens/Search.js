import React from 'react';
import { Chip } from 'react-native-paper';
import { TextInput, View,TouchableOpacity,StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCheck, faCar, faCake , faDashboard, faFaceAngry, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native'; 

const Search = () => {
const navigation = useNavigation();
return (
  <View style={styles.container}>
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
      >
        <FontAwesomeIcon icon={faArrowLeft} size={30} color="white" />
      </TouchableOpacity>
      <TextInput style={styles.textInput}></TextInput>
    </View>
  <View style={{
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '95%',
  }}>
   <TouchableOpacity>
    <Chip style={styles.chip} icon={() => 
          <FontAwesomeIcon icon={faCheck} size={20} color="" />
      }>Example</Chip>
   </TouchableOpacity>
   <TouchableOpacity>
    <Chip style={styles.chip} icon={() => 
          <FontAwesomeIcon icon={faCar} size={20} color="" />
      }>Example Example Example</Chip>
   </TouchableOpacity>
   <TouchableOpacity>
    <Chip style={styles.chip} icon={() => 
          <FontAwesomeIcon icon={faCake} size={20} color="" />
      }>Example Example</Chip>
   </TouchableOpacity>
   <TouchableOpacity>
    <Chip style={styles.chip} icon={() => 
          <FontAwesomeIcon icon={faDashboard} size={20} color="" />
      }>Example</Chip>
   </TouchableOpacity>
   <TouchableOpacity>
    <Chip style={styles.chip} icon={() => 
          <FontAwesomeIcon icon={faFaceAngry} size={20} color="" />
      }>Example Example Example</Chip>
   </TouchableOpacity>    
  </View>
  </View>
);
}
export default Search;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'black',
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
    borderWidth : 5,
    borderColor : 'white',
  },
  headerContainer : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '95%',
    alignItems: 'center',
  }
});