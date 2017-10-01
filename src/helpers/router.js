import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, TabNavigator, NavigationActions } from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";

import Login from '../Login/Login';

import Confirmation from '../UserStack/Confirmation';
import JoinScreen from '../UserStack/JoinScreen';
import VotingScreen from '../UserStack/VotingScreen';
import VotePushScreen from '../UserStack/VotePushScreen';

import Profile from '../RootScroll/Profile';
import MymatchesScreen from '../RootScroll/MymatchesScreen';
import ScrollTab from '../RootScroll/ScrollTab';
import Events from '../RootScroll/Events/Events';

import Edit from '../EditStack/Edit';
import GenderModal from '../EditStack/GenderModal';
import WorkModal from '../EditStack/WorkModal';
import UniversityModal from '../EditStack/UniversityModal';

import SettingsScreen from '../SettingsStack/SettingsScreen';

import ManagePermissionScreen from '../ManagerStack/ManagePermissionScreen';
import ManageScreen from '../ManagerStack/ManageScreen';
import VotingStatusScreen from '../ManagerStack/VotingStatusScreen';
import MatchScreen from '../ManagerStack/MatchScreen';


import ModalStack from './AppNavigation';

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const ResetToSignedOut = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [NavigationActions.navigate({ routeName: 'Login' })],
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
      Login: {
        screen: Login,
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    },
    {
      headerMode: "none",
      mode: "modal",
      initialRouteName: signedIn ? "ModalStack" : "Login" 
    }
  );
};

