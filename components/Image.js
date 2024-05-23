import { StyleSheet, Text, View ,Image, TouchableOpacity} from 'react-native'
import React ,{useState}from 'react'
import Modal from 'react-native-modal';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Imagee = (props) => {

let { show, uri, close } = props;

const renderModalContent = (show) => (
    show === true ? 
    <View
        style={styles.container}
    >
        <TouchableOpacity
            //tăt modal
            onPress={() => close()}
            style={{position: 'absolute', top: 10, right: 10, zIndex: 1}}
        >
            <FontAwesomeIcon icon={faXmark} size={30} color='white' onPress={() => setShow(false)} />
        </TouchableOpacity>
        <Image
            source={{ uri: uri }}
            style={{width: '100%', height: '100%',backgroundColor: 'transparent'}}
            resizeMode='contain'
        />
    </View> 
    : 
    <View>
        <Text></Text>
    </View>
)

  return (
    
    <Modal isVisible={show}>
        {renderModalContent(show)}
    </Modal>
    
  )
}

export default Imagee

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})