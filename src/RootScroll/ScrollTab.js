import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { StackNavigator } from 'react-navigation';


import { apiMiddleware, reducer } from '../helpers/redux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import Profile from './Profile';
import Events from './Events/Events';
import Mymatches from './MymatchesScreen';

const store = createStore(reducer, {}, applyMiddleware(apiMiddleware));
store.dispatch({type: 'GET_EVENT_DATA'});
const USER_KEY = "auth-demo-key";
export default class ScrollTab extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      initialPage: 0
    };
  }

  componentWillMount() { 
    console.log('componentWillMount ScrollTab')
    AsyncStorage.getItem(USER_KEY).then((user) => {
      this.setState({
        isLoading: false,
        user: JSON.parse(user)
      });
    });

    if (this.props.navigation.state.params && typeof this.props.navigation.state.params.paramm !== 'undefined') {
       this.setState({
         initialPage: this.props.navigation.state.params.paramm
       })
     } 
  };

  render() { // make rerender 

    // const { paramm } = this.props;
  
//    const { user } = this.props;
    // const user  = this.props.screenProps
    // fetch user: https://stackoverflow.com/questions/33553112/react-native-asyncstorage-fetches-data-after-rendering
    
    if (this.state.isLoading) {
      return <ActivityIndicator
        animating={true} // loading
        style={styles.loader}
        size="large"
      />
    }
    // this is the content you want to show after the promise has resolved

    return (
      <Provider store={store}> 
        <ScrollableTabView
          style={{
            marginTop: 20,
            backgroundColor: 'white',
          }}
          initialPage={this.state.initialPage} 
          tabBarBackgroundColor='white'
          renderTabBar={() => <ScrollableTabBar />}
        >
          <View  tabLabel='Profile'>
            <Profile user={this.state.user} navigation={this.props.navigation}/> 
          </View>
          <View tabLabel='Events'>
            <Events user={this.state.user} navigation={this.props.navigation}/>
          </View>
          <View tabLabel='Mymatches'>
            <Mymatches person={this.state.user} navigation={this.props.navigation}/>
          </View>
        </ScrollableTabView> 
      </Provider>  
    );
  };

}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',     // center horizontally
    justifyContent: 'center', // center vertically
    backgroundColor: 'white'
  }
});