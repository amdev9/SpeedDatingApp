import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
  AsyncStorage
} from 'react-native';



import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Profile from './Profile';
import Events from './Events';
import Mymatches from './MymatchesScreen';
// import ModalStack from './navi/ModalStack';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { apiMiddleware, reducer } from './redux';


import { StackNavigator } from 'react-navigation';

import SettingsScreen from './SettingsScreen';
// import Edit from './Edit';

// Create Redux store
const store = createStore(reducer, {}, applyMiddleware(apiMiddleware));

// Fetch movie data
store.dispatch({type: 'GET_EVENT_DATA'});



// Gender, University, Work, 
import Edit from './Edit';
import GenderModal from './modal/GenderModal';
import WorkModal from './modal/WorkModal';
import UniversityModal from './modal/UniversityModal';


const USER_KEY = "auth-demo-key";

export default class ScrollTab extends Component {
  // static propTypes = {
  //   user: PropTypes.object.isRequired
  // };

  // getUser = async () => {
  //   var res = await AsyncStorage.getItem(USER_KEY);
  //   return JSON.parse(res);
  // }

  render() {
    // const { user } = this.props;
    // const user  = this.props.screenProps
    
    // !!!!!!!! fetch user: https://stackoverflow.com/questions/33553112/react-native-asyncstorage-fetches-data-after-rendering
    
    return (
      <View><Text>Cool</Text></View> 
        

        // <Provider store={store}> 
        //   <ScrollableTabView
        //     style={{
        //         marginTop: 20
        //     }}
        //     initialPage={0} // param choose 'Profile' || Events || Mymatches
        //     renderTabBar={() => <ScrollableTabBar />}
        //   >
        //     <View  tabLabel='Profile'>
        //       <Profile user={user} navigation={this.props.navigation}/> 
        //     </View>
        //     <View tabLabel='Events'>
        //         <Events user={user} navigation={this.props.navigation}/>
        //     </View>
        //     <View tabLabel='Mymatches'>
        //         <Mymatches person={user} navigation={this.props.navigation}/>
        //     </View>
        //   </ScrollableTabView> 
        // </Provider>
    );
  };

}

