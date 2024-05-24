import React from 'react';
import Home from '../screens/Home';
import Bio from '../screens/Bio';
import Chat from '../screens/Chat';
import Settings from '../screens/Setting';
import TestTabView from '../screens/TabViewChat';
import Test from '../screens/Test';
import VideoCall from '../screens/VideoCall';
import Notification from '../screens/Notification';
import CallingScreen from '../screens/CallingScreen';


import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHome,faComment, faUser, faPhone , faCamera,faBars, faBell} from '@fortawesome/free-solid-svg-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Badge } from 'react-native-paper';
import { View } from 'react-native';

import { useSelector } from 'react-redux';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {

const mode = useSelector((state) => state.mode.mode);
const colors = useSelector((state) => {
  switch (mode) {
    case 'dark':
      return state.theme.darkColors;
    case 'light':
      return state.theme.lightColors;
    default:
      return state.theme.defaultColors;
  }
}
);

  return (
    <Tab.Navigator 
    
    screenOptions={{
      tabBarStyle: { backgroundColor: colors.background},      
      tabBarActiveTintColor: colors.iconActive,
      tabBarInactiveTintColor: colors.iconInactive,
      tabBarIndicatorStyle: {
        backgroundColor: '#808080',
        height: 3,
      },
       
      }}
    >
        <Tab.Screen 
            name="Home" 
            component={Home}
            options={{
            tabBarIcon: ({ color }) => (
              <FontAwesomeIcon icon={faHome} size={25} color={color} />
            ),
            tabBarShowLabel: false,
            }}
        />
        <Tab.Screen 
            name="Chat" 
            component={TestTabView} 
            options={{
                tabBarIcon: ({ color }) => (
                  <View>
                    <FontAwesomeIcon icon={faComment} size={25} color={color} />
                    {/* <Badge style={{ position: 'absolute', top: -7, right: -10 }}>3</Badge> */}
                  </View>
                ),
                tabBarShowLabel: false,
            }}
        />
        <Tab.Screen 
            name="Bio" 
            component={Bio} 
            options={{
                tabBarIcon: ({ color }) => (
                  <FontAwesomeIcon icon={faUser} size={25} color={color} />
                ),
                tabBarShowLabel: false,
            }}
        />
          <Tab.Screen
            name="Notification"
            component={Notification}
            options={{
                tabBarIcon: ({ color }) => (
                  <FontAwesomeIcon icon={faBell} size={25} color={color} />
                ),
                tabBarShowLabel: false,
            }}
        />
        <Tab.Screen
            name="Setting"
            component={Settings}
            options={{
                tabBarIcon: ({ color }) => (
                  <FontAwesomeIcon icon={faBars} size={25} color={color} />
                ),
                tabBarShowLabel: false,
            }}
        />
      
    </Tab.Navigator>
    
    
  );
}

export default MyTabs;