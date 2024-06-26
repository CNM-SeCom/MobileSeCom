import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Avatar from './Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const heigh = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const ConversationUnit = (props) => {
    const {image, name, newMess, onPress, time} = props;

const navigation = useNavigation();

const mode = useSelector((state) => state.mode.mode);
const colors = useSelector((state) => {
    switch (mode) {
        case 'dark':
        return state.theme.darkColors;
        default:
            return state.theme.lightColors;
    }
}
);

  return (
    <TouchableOpacity 
    onPress={() => onPress()} 
    style={[
        {backgroundColor : colors.background},
        styles.container]}>
        <Avatar 
            image={image}
        />
        <View>
        <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#808080',
        }}>{name}</Text>
        <Text style={{
            fontSize: 12,
            color: '#808080',
        }}>{newMess}</Text>
       
        </View>
        <View style={{
            right : 10,
            position: 'absolute',
        }} >
            {time ? <Text style={{
                fontSize: 12,
                color: '#808080',
                }}>{time}</Text> : null
            }
        </View>
    </TouchableOpacity>
  )
}

export default ConversationUnit

const styles = StyleSheet.create({
    container: {
        width: width * 0.97,
        height: 70,
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 10,
        flexDirection: 'row',
        color: '#fff',
        borderColor: '#808080',
        borderBottomWidth : 1,
        
    },
})