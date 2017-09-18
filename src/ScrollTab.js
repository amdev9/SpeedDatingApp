import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
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


export default class ScrollTab extends Component {
  // static propTypes = {
  //   user: PropTypes.object.isRequired
  // };

  render() {
    // const { user } = this.props;
    const user  = this.props.screenProps
    return (
        <Provider store={store}> 
            
           {/* <ModalStack screenProps={
                   user
                  } /> */}

           <ScrollableTabView
            style={{
                marginTop: 20
            }}
            initialPage={0} // param choose 'Profile' || Events || Mymatches
            renderTabBar={() => <ScrollableTabBar />}
          >
            <View  tabLabel='Profile'>
              <Profile user={user}  navigation={this.props.navigation}/> 
            </View>
            <View tabLabel='Events'>
                <Events user={user}/>
            </View>
            <View tabLabel='Mymatches'>
                <Mymatches person={user}/>

            </View>
          </ScrollableTabView> 
        </Provider>
    );
  };

}

