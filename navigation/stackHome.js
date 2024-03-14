import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import  Login from '../screens/Login';
import TabHome from './tab';
import Intro from '../screens/Intro';
import Home from '../screens/Home';
import Header from '../screens/HeaderStack';
import Conversation from '../screens/Conversation';
import EditProfile from '../screens/EditProfile';
import Search from '../screens/Search';
import ChooseImage from '../screens/ChooseImage';
import Register from '../screens/Register';
import ForgotPass from '../screens/ForgotPass';

// import VideoCall from '../screens/VideoCall';

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
    
    screenOptions={{headerShown : true}}>
      {/* <Stack.Screen name="Intro" component={Intro} options={{headerShown : false}}/> */}
      <Stack.Screen name="Login" component={Login} options={{headerShown : false}}/>
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="TabHome" component={TabHome} options={{header: props => <Header {...props} />}}/>
      <Stack.Screen name="Search" component={Search} options={{headerShown : false}}/>
      <Stack.Screen name="ChooseImage" component={ChooseImage} options={{headerShown : false}}/>
      <Stack.Screen name="Register" component={Register} options={{headerShown : false}}/>   
      <Stack.Screen name="ForgotPass" component={ForgotPass} options={{headerShown : false}}/>
    </Stack.Navigator>
  );
}

export default MyStack;