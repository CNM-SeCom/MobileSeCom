import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image , TouchableOpacity, Text} from 'react-native'
import { Input, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import ip from '../data/ip';

const Register = () => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+])[A-Za-z\d!@#$%^&*()-+]{8,}$/;
    const navigate = useNavigation();
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/amafsgal21le2xhy4jgy.jpg' );
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState(0);
    const [active, setActive] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);


    handleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
      };


    const register = () => {
        console.log('Phone: ', phone);
        console.log('Password: ', password);
        console.log('Confirm Password: ', confirmPassword);
        if (phone === '' || password === '' || confirmPassword === '') {
            alert('Please fill all the fields');
        } 
        else if (passwordRegex.test(password) === false) {
            alert('Password should contain at least one uppercase letter, one lowercase letter, one number and one special character');
        }
        else if (phone.length < 10) {
            alert('Phone Number should be of 10 digits');
        }
        else if (password !== confirmPassword) {
            alert('Password and Confirm Password should be same');
        }else{
            const data = {
                phone: phone,
                pass: password,
                gender: gender,
                name: name,
            }
            console.log(data);
            axios.post('http://'+ip+':3000/create', data)
            .then((response) => {
                alert('Account Created Successfully');
                navigate.navigate('Login');
            })
            .catch((error) => {
                console.log('Error: ', error.response.data.message);
                alert(error.response.data.message);})
        }
    }

    useEffect(() => {
            if (active) {
                setAvatar('https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/amafsgal21le2xhy4jgy.jpg' );
            } else {
                setAvatar('https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg');
            }
        }
    ), [gender, active];

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
                 label="Số điện thoại"
                 style={styles.input}
                onChangeText={(text) => setPhone(text)}
                />
                <TextInput
                 mode="outlined"
                 label="Tên người dùng"
                 style={styles.input}
                 onChangeText={(text) => setName(text)}
                />
                <View>
                <TextInput
                    mode="outlined"
                    label="Mật khẩu"
                    style={styles.input}
                    secureTextEntry={!isShowPassword}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={{
                        position : 'absolute',
                        right : 10,
                        top : 30,
                        backgroundColor : 'white',
                        }}
                        onPress={handleShowPassword}
                        >
                <Ionicons name="eye-outline" size={24} color="#000" />
                </TouchableOpacity>
                </View>
                <View>
                <TextInput
                    mode="outlined"
                    label="Nhập lại mật khẩu"
                    style={styles.input}
                    secureTextEntry={!isShowPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                />
                <TouchableOpacity style={{
                        position : 'absolute',
                        right : 10,
                        top : 30,
                        }}
                        onPress={handleShowPassword}
                        >
                <Ionicons name="eye-outline" size={24} color="#000" />
                </TouchableOpacity>
                </View>
                <View style={styles.genderContainer}>
                   {
                          active ? 
                          <TouchableOpacity 
                          onPress={() => {
                            setGender(0);
                            setActive(false);
                          }}
                          style={[styles.buttonGender, styles.leftButton,{backgroundColor : 'green'}]}>
                            <Text style={styles.textOnActive}>Nam</Text>
                          </TouchableOpacity>
                          :
                          <TouchableOpacity 
                          onPress={() => {
                            setGender(1);
                            setActive(true);
                          }}
                          style={[styles.buttonGender, styles.leftButton]}>
                            <Text style={styles.textOnInActive}>Nam</Text>
                          </TouchableOpacity>
                   }
                    <View style={styles.avatarContainer}>
                        {
                            active ?
                            <Image
                                style={styles.avatar}
                                source={{uri: 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/amafsgal21le2xhy4jgy.jpg' }}
                            />
                            :
                            <Image
                                style={styles.avatar}
                                source={{uri : 'https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/jfvpv2c7etp65u8ssaff.jpg'}}
                            />
                        }
                    </View>
                    {
                            !active ? 
                            <TouchableOpacity 
                            onPress={() => {
                                setGender(1);
                                setActive(true);
                            }}
                            style={[styles.buttonGender, styles.rightButton,{backgroundColor : 'green'}]}>
                                <Text style={styles.textOnActive}>Nữ</Text>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity 
                            onPress={() => {
                                setGender(0);
                                setActive(false);
                            }}
                            style={[styles.buttonGender, styles.rightButton]}>
                                <Text style={styles.textOnInActive}>Nữ</Text>
                            </TouchableOpacity>
                    }
                </View>
                </View>
                <TouchableOpacity 
                onPress={() =>{register()}}
                style={styles.button}>
                    <Text style={styles.titleButton}>
                        Create Account
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={
                    () => {
                        navigate.navigate('Login');
                    }
                }
                style={styles.button}>
                    <Text style={styles.titleButton}>
                        Login
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
        marginTop: 20,
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
    },
    genderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
      },
      buttonGender: {
        flex: 1,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightgray',
      },
      leftButton: {
        borderTopLeftRadius: 25,
        borderBottomLeftRadius: 25,
      },
      rightButton: {
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
      },
      buttonText: {
        color: 'blue',
      },
      avatarContainer: {
        width: 100,
        height: 100,
        overflow: 'hidden',
        marginHorizontal: 10,
      },
      avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
      },
      textOnActive :{
        color: 'white',
        fontWeight: 'bold'
      },
      textOnInActive :{
        color: 'black',
        fontWeight: 'bold'
      },
});

export default Register;