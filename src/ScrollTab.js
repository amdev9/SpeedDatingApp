import React, { Component, PropTypes } from 'react';
import {
  Text,
  View,
} from 'react-native';



import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import Profile from './Profile';
import Events from './Events';
import Mymatches from './MymatchesScreen';
import ModalStack from './navi/ModalStack';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { apiMiddleware, reducer } from './redux';

// Create Redux store
const store = createStore(reducer, {}, applyMiddleware(apiMiddleware));

// Fetch movie data
store.dispatch({type: 'GET_EVENT_DATA'});



export default class ScrollTab extends Component {
  static propTypes = {
    user: PropTypes.func.isRequired
  };

  render() {
    const { user } = this.props;
    return (
        <Provider store={store}> 
          <ScrollableTabView
            style={{
                marginTop: 20
            }}
            initialPage={0} 
            renderTabBar={() => <ScrollableTabBar />}
          >
            <View tabLabel='Profile'>
                <ModalStack user={user} />
                {/* <Profile user={user}/> */}
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

