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


const EditStack = StackNavigator({
  Edit: {
    screen: Edit,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Gender: {
    screen: GenderModal,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  University: {
    screen: UniversityModal,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Work: {
    screen: WorkModal,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
}, {
  // In modal mode screen slides up from the bottom
  mode: 'modal',
  // No headers for modals. Otherwise we'd have two headers on the screen, one for stack, one for modal.
  headerMode: 'none',
});




const ModalStack = StackNavigator({
  Profile: { // change to scrolltab
    screen: Profile,
    navigationOptions: (props) => ({
      user: props.screenProps,
      gesturesEnabled: false
    }), 
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
  Edit: {
    screen: EditStack,
    navigationOptions: {
      gesturesEnabled: false
    }
  },
}, {
  // In modal mode screen slides up from the bottom
  mode: 'modal',
  // No headers for modals. Otherwise we'd have two headers on the screen, one for stack, one for modal.
  headerMode: 'none',
});


export default class ScrollTab extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired
  };

  render() {
    const { user } = this.props;
    return (
        <Provider store={store}> 
            
           {/* <ModalStack screenProps={
                   user
                  } />    */}

     

           <ScrollableTabView
            style={{
                marginTop: 20
            }}
            initialPage={0} 
            renderTabBar={() => <ScrollableTabBar />}
          >
            <View  tabLabel='Profile'>
            <ModalStack screenProps={
                   user
                  } /> 
              {/* <Profile user={user}/>  */}
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

