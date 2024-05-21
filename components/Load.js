import { StyleSheet, Text, View,ActivityIndicator, Image } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal';
import { ProgressBar, MD3Colors } from 'react-native-paper';


const Load = (props) => {

let { show } = props;

const renderModalContent = (show) => (
    show === true ? 
    <View
        style={styles.modalContent}
    >
        {/* <Image
            source={require('../assets/loading-cat.png')}
            style={{
                width: 130,
                height: 130,
                borderRadius: 10,
            }}
        /> */}
        <ActivityIndicator size="large" color="#0000ff" />
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

export default Load

const styles = StyleSheet.create({
    modalContent: {
        width: 70,
        height: 70,
        backgroundColor: 'white',
        padding: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        alignSelf: 'center',
    },
})