import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, TabNavigator, NavigationActions } from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";

import Login from '../Login/Login';
import Fullfill from '../Login/Fullfill';
import ModalStack from './AppNavigation';


const LoginStack = StackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Fullfill: {
    screen: Fullfill,
    navigationOptions: {
      gesturesEnabled: false
    }
  }
}, {
    mode: 'modal',
    headerMode: 'none',
  });

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const ResetToSignedOut = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [NavigationActions.navigate({ routeName: 'LoginStack' })], // Login
})

export const ResetToSignedIn = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [
    NavigationActions.navigate({ routeName: 'ModalStack' })
  ]
})

export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      ModalStack: { // AppWithNavigationState
        screen: ModalStack,
        navigationOptions: {
          gesturesEnabled: false
        }
      },
      LoginStack: { // Login
        screen: LoginStack, // login
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: signedIn ? "ModalStack" : "LoginStack" // login 
    }
  );
};

