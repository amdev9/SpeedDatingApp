import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Button,
  Text,
  ScrollView,
  RefreshControl
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Icon from 'react-native-vector-icons/Ionicons';

import _ from 'lodash';
import EventPoster from './EventPoster';

import EventPopup from './EventPopup';
import { defaultStyles } from '../../styles';

import ScrollViewElements from './ScrollViewElements';

import { fetchEvents } from '../../helpers/actions';

import { connect } from 'react-redux';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
  }),
  dispatch => ({
    refresh: () => dispatch(fetchEvents()),  // {type: 'GET_EVENT_DATA'}
  }),
)
export default class Events extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      popupIsOpen: false,
      selectedIndex: 1,
      chosenTable: null
    };
  }

  
  openEvent = (event) => {
    this.setState({
      popupIsOpen: true,
      event,	
    });
  }
  
  closeEvent = () => {
    this.setState({
      popupIsOpen: false,
      // Reset values to default ones
      chosenDay: 0,
      chosenTime: null,
    });
  }

  bookEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Confirmation', {
      event: this.state.event,
      participant: this.props.user 
    }); 
  }

  joinEvent = () => {
    if ( this.state.chosenTable == null) {
      alert('Please select table');
    } else {
      // alert('U Selecte table ' + this.state.chosenTable);
      this.closeEvent();
      const { navigate } = this.props.navigation;
      this.props.user.table = this.state.chosenTable + 1; // navigation.state.params.person
      navigate('Join', {
        // table: this.state.chosenTable,
        event: this.state.event,
        person: this.props.user 
      }); 
    }
  }

  manageEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Manage', {
      event: this.state.event,
      person: this.props.user 
    }); 
  }

  manageEventRequest = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('ManagePermission', {
      event: this.state.event,
      person: this.props.user,
    }); 
  }

  chooseTable = (table) => {
    this.setState({
      chosenTable: table,
    });
  }

  componentWillMount() { 
    this.props.refresh();
  }

  render() {
    const { events, loading, refresh } = this.props;  
    const { user } =  this.props;
    return (
      <View style={styles.container}>
      
        <View style={styles.bottomContent}>
          <SegmentedControlTab 
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            
            values={['Мои', 'Найти']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={(index) => {
              this.setState({selectedIndex: index});
            }}
          />
        </View>

        {events 
          ? 
            <ScrollViewElements 
              selected={this.state.selectedIndex}
              events={events}
              user={user}
              onOpenEvent={this.openEvent}
              loading={loading}
              refresh={refresh}
            /> 
          : <ActivityIndicator
              animating={loading}
              style={styles.loader}
              size="large"
            />
        }

        <EventPopup
          event={this.state.event}
          person={user}
          isOpen={this.state.popupIsOpen}
          onClose={this.closeEvent}
          onBook={this.bookEvent}
          onJoin={this.joinEvent}
          onManage={this.manageEvent}
          onManageRequest={this.manageEventRequest}
          chosenTable={this.state.chosenTable}
          onChooseTable={this.chooseTable}
        />
      </View>
      
    );
  }

}

const styles = StyleSheet.create({
  tabStyle: {
    borderColor: '#3f88fb',
    
  },
  activeTabStyle: {
      backgroundColor: '#3f88fb'
  },
  tabTextStyle: {
      color: '#3f88fb'
  },
  gradient: {
    width: 400,
    height: 200,
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    // height: 64
    // backgroundColor: '#FFFFFF' //'#1EAAF1'
  },
  navBarButton: {
    color: '#262626',
    textAlign:'center',
    width: 64
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 18,
    // marginTop: 5
  },
  container: {
    height: 500, // change ti flex????
    // flex: 1,               // fixed
    //paddingTop: 20,         // start below status bar
    backgroundColor: '#FFFFFF'
  },
  loader: {
    flex: 1,
    alignItems: 'center',     // center horizontally
    justifyContent: 'center', // center vertically
  },
  

  bottomContent: {
    // margin: 30,
    // borderTopColor: '#262626',
    // borderRadius: 1,
    marginTop: 5, 
    marginRight: 10,
    marginLeft: 10
  }
});