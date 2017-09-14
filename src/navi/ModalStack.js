import React from 'react';
import { Button, ScrollView, Text } from 'react-native';
import { StackNavigator } from 'react-navigation';

import Profile from '../Profile';
import SettingsScreen from '../SettingsScreen';
import Edit from '../Edit';

export default ModalStack = StackNavigator({
  Profile: {
    screen: Profile,
    // add params through navigationOptions:  { user }
  },
  Settings: {
    screen: SettingsScreen
  },
  Edit: {
    screen: Edit
  },
}, {
  // In modal mode screen slides up from the bottom
  mode: 'modal',
  // No headers for modals. Otherwise we'd have two headers on the screen, one for stack, one for modal.
  headerMode: 'none',
});

