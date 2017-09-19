import React from "react";
import { Platform, StatusBar } from "react-native";
import { StackNavigator, TabNavigator, NavigationActions } from "react-navigation";
import { FontAwesome } from "react-native-vector-icons";

//////

import Login from './login';
import Events from '../src/Events';
import Confirmation from '../src/Confirmation';
import Profile from '../src/Profile';
import Edit from '../src/Edit';
import ManageScreen from '../src/ManageScreen';
import VotingScreen from '../src/VotingScreen';
import VotingStatusScreen from '../src/VotingStatusScreen';
import VotePushScreen from '../src/VotePushScreen';
import MymatchesScreen from '../src/MymatchesScreen';
import MatchScreen from '../src/MatchScreen';
import JoinScreen from '../src/JoinScreen';
import ManagePermissionScreen from '../src/ManagePermissionScreen';
import SettingsScreen from '../src/SettingsScreen';
import GenderModal from '../src/modal/GenderModal';
import WorkModal from '../src/modal/WorkModal';
import UniversityModal from '../src/modal/UniversityModal';
import ScrollTab from '../src/ScrollTab';

const headerStyle = {
  marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

export const ResetToSignedOut = NavigationActions.reset({
  index: 0,
  key: null,
  actions: [NavigationActions.navigate({ routeName: 'Login' })],
})

export const ResetToSignedIn = NavigationActions.reset({ // change to func with arg user
  index: 0,
  key: null,
  actions: [
    NavigationActions.navigate({ routeName: 'ModalStack' })
  ]
})


// NAVIGATION SCHEME
//   Login
//   ModalStack: 
//     ScrollTab (main): // navigate ScrollTab(tabname = ['Profile', 'Events', 'Mymatches'])
//       Profile
//       Events
//       Mymatches
//     Settings
//     EditStack:
//       Edit (main)
//       Gender
//       Work
//       University
//     Confirmation
//     ManagePermission
//     UserNavigator (StackNavigator):  
//       ->Join
//       -->Voting
//       --->VotePush
//     ManagerNavigator (StackNavigator):  
//       ->Manage
//       -->VotingStatus
//       --->Match
       

const EditStack = StackNavigator({
  Edit: {
    screen: Edit,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Gender: {
    screen: GenderModal,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  University: {
    screen: UniversityModal,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Work: {
    screen: WorkModal,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
}, {
  mode: 'modal',
  headerMode: 'none',
});

const UserNavigator = StackNavigator({
  Join: { screen: JoinScreen },
  Voting: { screen: VotingScreen },
  VotePush: { screen: VotePushScreen },   
}, {
  headerMode: 'none',
});

const ManagerNavigator = StackNavigator({
  Manage: { screen: ManageScreen },
  VotingStatus: { screen: VotingStatusScreen },
  Match: { screen: MatchScreen },   
}, {
  headerMode: 'none',
});

export const ModalStack = StackNavigator({
  ScrollTab: { 
    screen: ScrollTab,
    // navigationOptions: (props) => ({
    //   user: props.user, //screenProps,
    //   gesturesEnabled: false
    // }), 
  },
  Settings: { screen: SettingsScreen },
  Edit: { screen: EditStack },
  Confirmation: { screen: Confirmation },
  ManagePermission: { screen: ManagePermissionScreen },
  // UserNavigator: { screen: UserNavigator }, 
  Join: { screen: JoinScreen }, // fix??
  Voting: { screen: VotingScreen },
  VotePush: { screen: VotePushScreen },   
  // ManagerNavigator: { screen: ManagerNavigator }
  Manage: { screen: ManageScreen }, // fix??
  VotingStatus: { screen: VotingStatusScreen },
  Match: { screen: MatchScreen },   

}, {
  mode: 'modal',
  headerMode: 'none',
});


export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      ModalStack: {
        screen: ModalStack,
        // navigationOptions: () => ({
        //   user: user,
        //   gesturesEnabled: false
        // }), 
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

