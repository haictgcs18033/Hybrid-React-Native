/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useContext, useEffect, useState} from 'react';

import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';

import LoginPage from './android/app/src/Page/LoginPage';
import {Provider} from 'react-redux';
import {Provider as PaperProvider} from 'react-native-paper';
import {store} from './android/app/src/redux/configStore';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RentalList from './android/app/src/Page/RentalList';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import User from './android/app/src/Page/User';
import Search from './android/app/src/Page/Search';
import Signup from './android/app/src/Page/Signup';
import rentalDetail from './android/app/src/Page/rentalDetail';
import More from './android/app/src/Page/More';
import {Button} from 'react-native-paper';
import Home from './android/app/src/Page/Home';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabHome = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          if (route.name === 'Home') {
            return <Icon name="home" size={size} color={color} />;
          } else if (route.name === 'Rental') {
            return <Icon name="list" size={size} color={color} />;
          } else if (route.name === 'Search') {
            return <Icon name="search" size={size} color={color} />;
          } else if (route.name === 'More') {
            return <Icon name="dollar-sign" size={size} color={color} />;
          } else {
            return <Icon name="user" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
      })}
      initialRouteName="Home">
      <Tab.Screen name="Home" component={Home}></Tab.Screen>
      <Tab.Screen
        name="Rental"
        options={{headerTitle: 'Your Rental Information'}}
        component={RentalList}></Tab.Screen>
      <Tab.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}></Tab.Screen>
      <Tab.Screen
        name="User"
        options={{headerTitle: 'User Account'}}
        component={User}></Tab.Screen>
      <Tab.Screen name="More" component={More} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="TabHome">
            <Stack.Screen
              name="TabHome"
              component={TabHome}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="Login"
              component={LoginPage}
              options={{headerShown: false}}></Stack.Screen>
            <Stack.Screen
              name="Signup"
              component={Signup}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Detail"
              options={({navigation}) => ({
                headerLeft: () => (
                  <TouchableHighlight
                    style={{marginEnd: 10, borderRadius: 100}}
                    onPress={() => {
                      navigation.goBack();
                    }}>
                    <View style={styles.backButton}>
                      <Icon
                        style={styles.backText}
                        name="angle-left"
                        size={35}
                      />
                    </View>
                  </TouchableHighlight>
                ),
              })}
              component={rentalDetail}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  backButton: {
    backgroundColor: 'white',
    width: 40,
    borderRadius: 100,
    height: 40,
    textAlign: 'center',
  },
  backText: {
    flex: 1,
    marginStart: 10,
  },
});

export default App;
