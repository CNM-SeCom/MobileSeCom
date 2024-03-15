import React from 'react';
import { View, useWindowDimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useState, useEffect } from 'react';
import Conversation from './Conversation';
import { useNavigation } from '@react-navigation/native';
import Chat from './Chat';
import GroupChat from './GroupChat';
import { TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';

import { FlatList } from 'react-native-gesture-handler';
import Avatar from '../components/Avatar';
import DataGroup from '../data/dataGroupChat';


const FirstRoute = () => (
  <Chat />
);

const SecondRoute = () => (
  <GroupChat />
);

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

export default function TabViewExample() {
  const navigation = useNavigation();
  const layout = useWindowDimensions();
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
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: 'white' }}
      style={{ backgroundColor: colors.background }} // Custom style for tabBar
      labelStyle={{ fontSize: 16, fontWeight: 'bold', color:colors.text }} // Custom style for tabBar label
    />
  );

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Đoạn chat' },
    { key: 'second', title: 'Nhóm chat' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      tabBarPosition='top'
      pagerStyle={{backgroundColor: 'pink'}}
      renderTabBar={renderTabBar}
    />
  );
}