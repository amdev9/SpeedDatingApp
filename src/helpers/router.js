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

import Events from '../Events/Events';

import Edit from '../EditStack/Edit';
import GenderModal from '../EditStack/GenderModal';
import WorkModal from '../EditStack/WorkModal';
import UniversityModal from '../EditStack/UniversityModal';

import SettingsScreen from '../SettingsStack/SettingsScreen';

import ManagePermissionScreen from '../ManagerStack/ManagePermissionScreen';
import ManageScreen from '../ManagerStack/ManageScreen';
import VotingStatusScreen from '../ManagerStack/VotingStatusScreen';
import MatchScreen from '../ManagerStack/MatchScreen';



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

// const UserNavigator = StackNavigator({
//   Join: { screen: JoinScreen },
//   Voting: { screen: VotingScreen },
//   VotePush: { screen: VotePushScreen },   
// }, {
//   headerMode: 'none',
// });

// const ManagerNavigator = StackNavigator({
//   Manage: { screen: ManageScreen },
//   VotingStatus: { screen: VotingStatusScreen },
//   Match: { screen: MatchScreen },   
// }, {
//   headerMode: 'none',
// });

export const ModalStack = StackNavigator({
  ScrollTab: { 
    screen: ScrollTab,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Settings: { 
    screen: SettingsScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Edit: { 
    screen: EditStack,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Confirmation: { 
    screen: Confirmation,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  ManagePermission: { 
    screen: ManagePermissionScreen,
    navigationOptions: {
      gesturesEnabled: false
    } 
  },
  // UserNavigator: { screen: UserNavigator }, 
  Join: { 
    screen: JoinScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  }, // fix??
  Voting: { 
    screen: VotingScreen,
    navigationOptions: {
      gesturesEnabled: false
    } 
  },
  VotePush: { 
    screen: VotePushScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  },   
  // ManagerNavigator: { screen: ManagerNavigator }
  Manage: { 
    screen: ManageScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  }, // fix??
  VotingStatus: { 
    screen: VotingStatusScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Match: { 
    screen: MatchScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  },   

}, {
  mode: 'modal',
  headerMode: 'none',
});


export const createRootNavigator = (signedIn = false) => {
  return StackNavigator(
    {
      ModalStack: {
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

