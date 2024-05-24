import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image , TouchableOpacity, Text, Dimensions} from 'react-native'
import { Input, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import ip from '../data/ip';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Modal, Portal, PaperProvider } from 'react-native-paper';



const { width, height } = Dimensions.get('window');

const Register = () => {
    const navigation = useNavigation();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-+])[A-Za-z\d!@#$%^&*()-+]{8,}$/;
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setMail] = useState('');
    const [dob , setDob] = useState(new Date());
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('https://res.cloudinary.com/dkwb3ddwa/image/upload/v1710070408/avataDefaultSeCom/amafsgal21le2xhy4jgy.jpg' );
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState(0);
    const [active, setActive] = useState(true);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [validDate, setValidDate] = useState(false);

    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const onChange = async(event, selectedDate) => {
        const currentDate = selectedDate || date;
        const sixYearsAgo = new Date();
        sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6); // Ngày 6 năm trước
        // Nếu ngày chọn rỗng hoặc nhỏ hơn ngày hiện tại và lớn hơn ngày 6 năm trước, thì cho phép cập nhật ngày
        if (currentDate < new Date() && currentDate < sixYearsAgo) {
            setDate(currentDate);
            setDob(currentDate);
            setValidDate(true);
        } else {
            alert('Ngày sinh không hợp lệ. Vui lòng chọn một ngày trong quá khứ và phải lớn hơn 6 tuổi.');
        }
        setShowDatePicker(false);
    };
    
    

    handleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
      };


    const navigateGetOTP = async() => {

        if (phone.length < 10) {
            alert('Số điện thoại không hợp lệ');
        }
        else if(!passwordRegex.test(password)) {
            alert('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt');
        }
        else if(mail === '') {
            alert('Email không được để trống');
        }
        else if(password !== confirmPassword) {
            alert('Mật khẩu không khớp');
        }
        else{
         await  axios.post('http://'+ip+'/checkPhoneExist', {phone : phone})
        .then((response) => {
            navigation.navigate('ConfirmOTP', { email: mail, type: 'register',phone: phone, password: password, name: name,
            gender : gender, dob: dob.toDateString()})
        })
        .catch((error) => {
            alert("Tài khoản đã tồn tại");})
        }


        // else{
        //     navigation.navigate('ConfirmOTP', { email: mail, type: 'register',phone: phone, password: password, name: name,
        //     gender : gender, dob: dob.toDateString()
        // });
        // }



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
                <Image style={styles.backgroundImage} source={require('../assets/logo_SeCom.png')} />
            </View>
            <View style={styles.wrapper}>
                <Text
                    style={styles.title}
                >
                    Đăng ký tài khoản
                </Text>
                <TextInput
                 mode="outlined"
                 label="Email"
                 style={styles.input}
                 onChangeText={(text) => setMail(text)}
                value={mail}
                />
                <View 
                    style={styles.wrapperPhoneDate}
                >
                <TextInput
                    mode="outlined"
                    label="Số điện thoại"
                    keyboardType='numeric'
                    style={styles.inputPhone}
                    onChangeText={(text) => setPhone(text)}
                    value={phone}
                />
                <TouchableOpacity
                    style={styles.pickerDate}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text>
                        {
                        validDate === true ?
                        date.toDateString()
                            :
                        'Chọn ngày sinh'
                        }
                    </Text>
                </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                        value={date}
                        mode="date"
                        display="spinner"
                        onChange={onChange}
                    />
                    )}
                </View>
                <TextInput
                 mode="outlined"
                 label="Tên người dùng"
                 style={styles.input}
                 onChangeText={(text) => setName(text)}
                 value={name}
                />
                <View>
                <TextInput
                    mode="outlined"
                    label="Mật khẩu"
                    style={styles.input}
                    secureTextEntry={!isShowPassword}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
                <TouchableOpacity style={{
                        position : 'absolute',
                        right : 10,
                        top : 20,
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
                    value={confirmPassword}
                />
                <TouchableOpacity style={{
                        position : 'absolute',
                        right : 10,
                        top : 20,
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
                          style={[styles.buttonGender, styles.leftButton,{backgroundColor : '#3559E0'}]}>
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
                            style={[styles.buttonGender, styles.rightButton,{backgroundColor : '#E26EE5'}]}>
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
                onPress={() =>{navigateGetOTP()}}
                style={styles.button}>
                    <Text style={styles.titleButton}>
                        Đăng ký
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={
                    () => {
                        navigation.navigate('Login');
                    }
                }
                >
                    <Text style={styles.titleButtonLogin}>
                        Bạn đã có tài khoản? Đăng nhập
                    </Text>
                </TouchableOpacity>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor:"#C3F8FF",
    },
    button: {
        width: '90%',
        marginTop: 20,
        backgroundColor: '#4CB9E7',
        padding: 10,
        borderRadius: 20
    },
    logoContainer: {
        alignItems: 'center',
    },
    input: {
        width: '98%',
        marginTop: 0,
        alignSelf: 'center'
    },
    wrapper : {
        width: '95%',
        borderWidth: 1,
        padding: 10,
        paddingBottom: 20,
        borderRadius : 20,
    },
    title :{
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center',  
        color: 'black'      
    },
    titleButton :{
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center', 
        color: 'black'       
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
      backgroundImage :{
        width: 200,
        height: 200,
      },
        titleButtonLogin :{
            fontSize: 15,
            fontWeight: 'bold',
            alignSelf: 'center', 
            color: 'black',
            marginTop: 10
        },
        inputPhone :{
            width: '50%',
            alignSelf: 'center'
        },
        pickerDate :{
            width: '40%',
            height: 45,
            alignSelf: 'center',
            marginTop: 5,
            backgroundColor: 'white',
            borderRadius: 5,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center'
        },
        wrapperPhoneDate :{
            width: '98%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            // backgroundColor: 'pink',
            alignSelf: 'center',
            alignItems: 'center',
        }
});

export default Register;