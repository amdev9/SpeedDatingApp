import React, { Component } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  SegmentedControlIOS,
  Button,
  Text
} from 'react-native';

import _ from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import EventPoster from './EventPoster';
import EventPopup from './popups/EventPopup';
import { defaultStyles } from './styles';

import { connect } from 'react-redux';

import SegmentedControlTab from 'react-native-segmented-control-tab'


@connect(
  state => ({
    events: state.events,
    loading: state.loading,
  }),
  dispatch => ({
    refresh: () => dispatch({type: 'GET_EVENT_DATA'}),
  }),
)
export default class Events extends Component {
  
  state = {
    popupIsOpen: false,
    selectedIndex: 1,
    chosenTable: null,       // choose first day by default
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
      participant: this.props.navigation.state.params.person 
    }); 
  }

  joinEvent = () => {
    if ( this.state.chosenTable == null) {
      alert('Please select table');
    } else {
      // alert('U Selecte table ' + this.state.chosenTable);
      this.closeEvent();
      const { navigate } = this.props.navigation;
      this.props.navigation.state.params.person.table = this.state.chosenTable + 1; // index + 1 = realvalue
      navigate('Join', {
        // table: this.state.chosenTable,
        event: this.state.event,
        person: this.props.navigation.state.params.person
      }); 
    }
  }

  manageEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Manage', {
      event: this.state.event,
      person: this.props.navigation.state.params.person
    }); 
  }

  manageEventRequest = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('ManagePermission', {
      event: this.state.event,
      person: this.props.navigation.state.params.user // person 
    }); 
  }

  chooseTable = (table) => {
    this.setState({
      chosenTable: table,
    });
  }

  render() {
    const { events, loading, refresh } = this.props;
    const { user } =  this.props //.navigation.state.params;

    return (
      <View style={styles.container}>
      
        {/* <View style={styles.navBar}>
          <Icon style={styles.navBarButton}
            onPress={() =>  this.props.navigation.navigate('Profile', {
              user: user
            })} name="ios-person-outline" size={30} color="#900" />
          <Text style={styles.navBarHeader}>Мероприятия</Text>
          <Icon style={styles.navBarButton}
            onPress={() => this.props.navigation.navigate('Mymatches', {
              person: user // change to user: user
            })} name="ios-chatboxes-outline" size={30} color="#900" /> 
        </View> */}
  
        {/* <SegmentedControlIOS tintColor="#3f88fb" style={styles.bottomContent} 
          values={['Мои', 'Найти']}
          selectedIndex={this.state.selectedIndex}
          onChange={(event) => {
            this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
          }}
        /> */}
        
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

        {events // and movies participants contains data && this.state.selectedIndex == 1
          ? <ScrollView
              contentContainerStyle={styles.scrollContent}
              // Hide all scroll indicators
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={refresh}
                />
              }
            >
              {events.map((event, index) => {
                if (this.state.selectedIndex == 0) {
                  if (event.participant_ids.includes(user._id) || event.manage_ids.includes(user._id)) { //(  typeof event.participants !== 'undefined' && event.participants.length > 0 &&  _.map(event.participants, '_id').indexOf(person._id) > -1 ) { 
                    return <EventPoster
                      event={event}
                      person={user}
                      onOpen={this.openEvent}
                      key={index}
                    /> 
                  }  
                } else {
                  return <EventPoster
                    event={event}
                    person={user}
                    onOpen={this.openEvent}
                    key={index}
                  /> 
                }
              }

              )}
            </ScrollView>
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
    // paddingVertical: 5,
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderColor: '#3f88fb',
    // borderWidth: 1,
    // backgroundColor: 'white',
  },
  activeTabStyle: {
      backgroundColor: '#3f88fb'
  },
  tabTextStyle: {
      color: '#3f88fb'
  },

  // header styles
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
    height: 600, // change ti flex????
    // flex: 1,               // fixed
    //paddingTop: 20,         // start below status bar
    backgroundColor: '#FFFFFF'
  },
  loader: {
    flex: 1,
    alignItems: 'center',     // center horizontally
    justifyContent: 'center', // center vertically
  },
  scrollContent: {
    paddingTop: 20, 
    flexDirection: 'row',   // arrange posters in rows
    flexWrap: 'wrap',       // allow multiple rows
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