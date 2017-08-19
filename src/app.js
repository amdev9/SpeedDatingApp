import React, { Component } from 'react';

 
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';

// AsyncStorage.clear();

import { StackNavigator } from 'react-navigation';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { apiMiddleware, reducer } from './redux';

// Create Redux store
const store = createStore(reducer, {}, applyMiddleware(apiMiddleware));

// Fetch movie data
store.dispatch({type: 'GET_EVENT_DATA'});

import Events from './Events';
import Confirmation from './Confirmation';
import Profile from './Profile';
import Edit from './Edit';
import Login from '../components/login';
import ManageScreen from './ManageScreen';
import VotingScreen from './VotingScreen';
import VotingStatusScreen from './VotingStatusScreen';
import VotePushScreen from './VotePushScreen';
import MymatchesScreen from './MymatchesScreen';
import MatchScreen from './MatchScreen';
import JoinScreen from './JoinScreen';
import ManagePermissionScreen from './ManagePermissionScreen';
import SettingsScreen from './SettingsScreen';

const MovieStack = StackNavigator({
  Login: { screen: Login },
  Profile: { screen: Profile },
  Events: { screen: Events }, //events
  Confirmation: { screen: Confirmation },
  Edit: { screen: Edit },
  Voting: { screen: VotingScreen },
  Mymatches: { screen: MymatchesScreen },
  Join: { screen: JoinScreen }, 
  Settings: { screen: SettingsScreen },
  // organizer screen
  VotePush: { screen: VotePushScreen },
  VotingStatus: { screen: VotingStatusScreen },
  Manage: { screen: ManageScreen },
  Match: { screen: MatchScreen },
  ManagePermission: { screen: ManagePermissionScreen }
}, {
  // In modal mode screen slides up from the bottom
  // mode: 'modal',
  // No headers for modals. Otherwise we'd have two headers on the screen, one for stack, one for modal.
  headerMode: 'none',
});

export default class App extends Component {
  render() {     
    return (
      <Provider store={store}> 
        <MovieStack /> 
      </Provider>
    )
  }
}


