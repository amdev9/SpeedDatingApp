import React from "react";
import { Platform, StatusBar } from "react-native";

import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';


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
import AgeModal from '../EditStack/AgeModal';


import SettingsScreen from '../SettingsStack/SettingsScreen';

import ManagePermissionScreen from '../ManagerStack/ManagePermissionScreen';
import ManageScreen from '../ManagerStack/ManageScreen';
import VotingStatusScreen from '../ManagerStack/VotingStatusScreen';
import MatchScreen from '../ManagerStack/MatchScreen';



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
  Age: {
    screen: AgeModal,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
}, {
    mode: 'modal',
    headerMode: 'none',
  });

export default ModalStack = StackNavigator({
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
  // user 
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
  // manager
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
