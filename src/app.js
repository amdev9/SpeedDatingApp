import React, { Component } from 'react'; 
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage, 
  Platform,
  AppState
} from 'react-native';

import { StackNavigator } from 'react-navigation';

import PushNotification from 'react-native-push-notification';

import { createRootNavigator } from "./helpers/router";
import { isSignedIn } from "./helpers/auth";


import { WS_URL } from "./helpers/constants";

import actions from './helpers/actions'


import { Provider } from 'react-redux';
import configureStore from './helpers/store';

let state = { 
  events: [], 
  loading: false, 
  participants: [],
  selected: [],
  person: null
}; // preloadedState - when init from background
const NOTIFICATION_TOKEN = "push-notification-token";

const store = configureStore(state)

const action = () => {
  return {
    type: 'WEBSOCKET:CONNECT',
    url: WS_URL 
  }
}

store.dispatch(action());//  actions.connect(WS_URL)


// AsyncStorage.clear(); 

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false,
      
    };
  }

  


  componentDidMount() {
    PushNotification.configure({
        onRegister: function(token) {
            console.log( 'TOKEN:', token );
            AsyncStorage.setItem(NOTIFICATION_TOKEN, JSON.stringify(token)); 
        },
        onNotification: function(notification) {
            console.log( 'NOTIFICATION:', notification );
        },
    });
  }

  componentWillMount() {
    isSignedIn()
      .then(res => {
        return this.setState({ signedIn: res, checkedSignIn: true })
      })
      .catch(err => alert("An error occurred: " + JSON.stringify(err)));
  }
  render() {
    const { checkedSignIn, signedIn } = this.state;
    // If we haven't checked AsyncStorage yet, don't render anything (better ways to do this)
    if (!checkedSignIn) {
      return null;
    }

    // create store here
    const Layout = createRootNavigator(signedIn); 
    return (
      <Provider store={store}> 
        <Layout />
      </Provider>
    );
  }
}



