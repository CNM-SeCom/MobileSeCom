import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Avatar = (props) => {
 
  const { image } = props;
  
  return (
    <View>
      <TouchableOpacity style={styles.container}>
        {image == '' ? <FontAwesomeIcon icon={faUser} size={30} color="#808080" /> : 
        <Image source={{ uri: image }} style={{ width: 60, height: 60, borderRadius: 30 }} />}

      </TouchableOpacity>
      <View style={styles.status}>

      </View>
      <View style={styles.newMess}>
        <Text style={styles.newMessText}> 1 </Text>
      </View>
    </View>
  )
}

export default Avatar

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#20E61D',
    position: 'absolute',
    bottom: -2,
    right: 10,
    borderWidth: 2,
  },
  newMess: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E62020',
    position: 'absolute',
    top: -2,
    right: 10,
    borderWidth: 2,
  },
  newMessText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    justifyContent: 'center',
  }
})