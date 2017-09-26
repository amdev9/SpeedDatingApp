import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  StyleSheet
} from 'react-native';

import { StackNavigator } from 'react-navigation';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import Profile from './Profile';
import Events from './Events/Events';
import Mymatches from './MymatchesScreen';

 




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

  render() {  
    if (this.state.isLoading) {
      return <ActivityIndicator
        animating={true} // loading
        style={styles.loader}
        size="large"
      />
    }
    
    return ( // move provider to app.js? 
      
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
      
    );
  };

}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',     
    justifyContent: 'center', 
    backgroundColor: 'white'
  }
});