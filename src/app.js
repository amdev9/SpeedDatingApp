import React, { Component } from 'react';

 
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage
} from 'react-native';



import { StackNavigator } from 'react-navigation';

// import { createStore, applyMiddleware } from 'redux';
// import { Provider } from 'react-redux';
// import { apiMiddleware, reducer } from './redux';

// Create Redux store
// const store = createStore(reducer, {}, applyMiddleware(apiMiddleware));

// Fetch movie data
// store.dispatch({type: 'GET_EVENT_DATA'});


import { createRootNavigator } from "../components/router";
import { isSignedIn } from "../components/auth";


// AsyncStorage.clear();

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      signedIn: false,
      checkedSignIn: false
    };
  }

  componentWillMount() {
    console.log('componentWillMount')
    isSignedIn()
      .then(res => {
        // console.log('res: ', res);
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

    const Layout = createRootNavigator(signedIn); 
    return <Layout />;
  }
}

//   state = {
//     user: undefined, // not logged in yet
//   };
//   onLoggedIn = (user) => {
//     this.setState({ user });
//   };
//   render() {     
//     const { user } = this.state;
//     return user
//       ? <ModalStack screenProps={user} />
//       : <Login onLoggedIn={this.onLoggedIn} />;
//   }
// }


