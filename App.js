import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackHome from './navigation/stackHome';
import { Provider } from 'react-redux';
import { View } from 'react-native';
import store from './redux/store';
import WS from 'react-native-websocket';
import { set_IdUser, getIdUser } from './data/idUser';
import { useEffect } from 'react';

export default function App() {
  return (

    <Provider store={store}>
      <NavigationContainer>
        <StackHome />
      </NavigationContainer>
    </Provider>
  );
}