import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackHome from './navigation/stackHome';
import { Provider } from 'react-redux';
import store from './redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackHome />
      </NavigationContainer>
    </Provider>
  );
}