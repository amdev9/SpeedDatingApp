import React, { Component } from 'react';


import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { apiMiddleware, reducer } from './redux';

// Create Redux store
const store = createStore(reducer, {}, applyMiddleware(apiMiddleware));

// Fetch movie data
store.dispatch({type: 'GET_MOVIE_DATA'});

import Movies from './Movies';
import Confirmation from './Confirmation';
import Profile from './Profile';
import Login from '../components/login';

const MovieStack = StackNavigator({
  Login: {
    screen: Login,
    path: 'login'
  },
  Profile: {
    screen: Profile,
    path: 'profile',
    navigationOptions: ({navigation}) => ({
      user: navigation.state.params.user,
    }),
  },
  Movies: {
    screen: Movies,
    path: 'movies'
  },
  Confirmation: {
    screen: Confirmation,
    path: 'confirmation/:movie',
    navigationOptions: ({navigation}) => ({
      code: navigation.state.params.code,
    }),
  }
}, {
  // In modal mode screen slides up from the bottom
  // mode: 'modal',
  // No headers for modals. Otherwise we'd have two headers on the screen, one for stack, one for modal.
  headerMode: 'none',
});


export default class App extends Component {

  render() {     
    return (
    // <View style={styles.container}>
       <Provider store={store}> 
          <MovieStack /> 
        </Provider>
    // </View>
    )
  }
  
}


