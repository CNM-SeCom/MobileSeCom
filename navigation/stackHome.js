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
import ConfirmOTP from '../screens/ConfirmOTP';
import ResetPass from '../screens/ResetPass';
import FriendList from '../screens/FriendList';
import ListFriendForward from '../screens/ListFriendForward';
import ConversationGroup from '../screens/ConversationGroup';
import ManagerGroup from '../screens/ManagerGroup';
import CallingScreen from '../screens/CallingScreen';
import CreatePost from '../screens/CreatePost';
import { useSelector } from 'react-redux';


import VideoCall from '../screens/VideoCall';

const Stack = createStackNavigator();

function MyStack() {

  const mode = useSelector((state) => state.mode.mode);
  const colors = useSelector((state) => {
      switch (mode) {
        case 'dark':
          return state.theme.darkColors;
        default:
          return state.theme.lightColors;
      }
    });
 

  return (
    <Stack.Navigator
    screenOptions={{headerShown : true}}>
      <Stack.Screen name="Intro" component={Intro} options={{headerShown : false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown : false}}/>
      <Stack.Screen name="Conversation" component={Conversation} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="TabHome" component={TabHome} options={{header: props => <Header {...props} />}}/>
      <Stack.Screen name="Search" component={Search} options={{headerShown : false}}/>
      <Stack.Screen name="ChooseImage" component={ChooseImage} options={{headerShown : false}}/>
      <Stack.Screen name="Register" component={Register} options={{headerShown : false}}/>   
      <Stack.Screen name="ConfirmOTP" component={ConfirmOTP} options={{headerShown : false}}/>
      <Stack.Screen name="ResetPass" component={ResetPass} options={{headerShown : false}}/>
      <Stack.Screen name="FriendList" component={FriendList} options={{headerShown : true,headerTitle:"Bạn bè",headerStyle:{backgroundColor:colors.background}, headerTintColor : colors.text }} />
      <Stack.Screen name="ListFriendForward" component={ListFriendForward} options={{headerShown : true,headerTitle:"Chọn bạn bè",headerStyle:{backgroundColor:colors.background}, headerTintColor : colors.text}} />
      <Stack.Screen name="ConversationGroup" component={ConversationGroup} options={{headerShown : true,headerTitle:"Nhóm",headerStyle:{backgroundColor:colors.background}, headerTintColor : colors.text}} />
      <Stack.Screen name="ManagerGroup" component={ManagerGroup} options={{headerShown : true,headerTitle:"Quản lý nhóm",headerStyle:{backgroundColor:colors.background}, headerTintColor : colors.text}} />
      <Stack.Screen name="VideoCall" component={VideoCall} options={{headerShown : false}}/>
      <Stack.Screen name="CreatePost" component={CreatePost} options={{headerShown : false}}/>
    </Stack.Navigator>
  );
}

export default MyStack;