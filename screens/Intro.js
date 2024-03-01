import { View, Text , StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native'
import React from 'react'
import Video from 'react-native-video'
import { useNavigation } from '@react-navigation/native'

export default function Intro() {

  const navigation = useNavigation();

  const handlePress = () => {{
      navigation.navigate('Login');
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
          <Video 
            source={require('../assets/intro.mp4')}
            style={styles.background}
            controls={false}
            resizeMode='cover'
            
          />
          <TouchableOpacity 
            onPress={handlePress}
            style={styles.button}>
            <Text style={styles.titleButton}>Getting Start</Text>
          </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container : {
    width : '100%',
    height : '100%',
    alignItems : 'center',
    
  },
  background : {
    width : '100%',
    height : '100%',
  },
  wrapper :{
    width : '100%',
    height : '100%',
    // paddingTop : Platform.OS === 'android' ? 35 : 0,
  },
  button : {
    position : 'absolute',
    bottom : 40,
    left : 20,
    right : 20,
    height : 50,
    backgroundColor : '#ffffff',
    borderRadius : 50,
    justifyContent : 'center',
    alignItems : 'center',
  },
  titleButton : {
    fontSize : 20,
    color : '#000000',
    fontWeight : 'bold',
  }
})