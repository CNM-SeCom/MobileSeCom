import React, { useState } from 'react';
import { View, StyleSheet, Image , TouchableOpacity, Text} from 'react-native'
import { Input, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import axios from 'axios';

const Register = () => {

    const navigate = useNavigation();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const register = () => {
        console.log('Phone: ', phone);
        console.log('Password: ', password);
        console.log('Confirm Password: ', confirmPassword);
        if (phone === '' || password === '' || confirmPassword === '') {
            alert('Please fill all the fields');
        } 
        else if (phone.length < 10) {
            alert('Phone Number should be of 10 digits');
        }
        else if (password !== confirmPassword) {
            alert('Password and Confirm Password should be same');
        }else{
            const data = {
                phone: phone,
                pass: password
            }
            console.log(data);
            axios.post('http://192.168.1.47:3000/create', data)
            .then((response) => {
                console.log('Response: ', response.data);
                alert('Account Created Successfully');
            })
            .catch((error) => {
                console.log('Error: ', error);
            })
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.backgroundImage} source={require('../assets/logoSec.png')} />
            </View>
            <View style={styles.wrapper}>
                <Text
                    style={styles.title}
                >
                    Create an account
                </Text>
                <TextInput
                 mode="outlined"
                 label="Phone Number"
                 style={styles.input}
                onChangeText={(text) => setPhone(text)}
                />
                <TextInput
                    mode="outlined"
                    label="Password"
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                />
                <TextInput
                    mode="outlined"
                    label="Confirm Password"
                    style={styles.input}
                    onChangeText={(text) => setConfirmPassword(text)}
                />
                </View>
                <TouchableOpacity 
                onPress={() =>{register()}}
                style={styles.button}>
                    <Text style={styles.titleButton}>
                        Create Account
                    </Text>
                </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        justifyContent: 'center'
    },
    button: {
        width: '90%',
        marginTop: 30,
        backgroundColor: '#3b5998',
        padding: 10,
        borderRadius: 20
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    input: {
        width: '98%',
        marginTop: 10,
        alignSelf: 'center'
    },
    wrapper : {
        width: '95%',
        borderWidth: 1,
        padding: 10,
        paddingBottom: 20,
        borderRadius : 20
    },
    title :{
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',        
    },
    titleButton :{
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center', 
        color: 'white'       
    }
});

export default Register;