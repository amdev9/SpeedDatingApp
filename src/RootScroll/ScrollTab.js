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


import { connect } from 'react-redux';
import { storeUser } from '../helpers/actions';

@connect(
  state => ({
    current_user: state.current_user
  }),
  dispatch => ({
    store_user: (user) => dispatch(storeUser(user))
  }),
)
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
      this.props.store_user(JSON.parse(user));
      this.setState({
        isLoading: false,
        // user: JSON.parse(user) // to redux
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

    return (
      <ScrollableTabView
        style={{
          backgroundColor: 'white'
        }}
        initialPage={this.state.initialPage}
        //tabBarBackgroundColor='white'
        renderTabBar={() => <ScrollableTabBar style={{ marginTop: 20 }} />}
      >
        <View tabLabel='Профиль'>
          <Profile navigation={this.props.navigation} />
        </View>
        <View tabLabel='Мероприятия'>
          <Events navigation={this.props.navigation} />
        </View>
        <View tabLabel='Совпадения'>
          <Mymatches navigation={this.props.navigation} />
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