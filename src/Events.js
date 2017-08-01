import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  SegmentedControlIOS
} from 'react-native';

import EventPoster from './EventPoster';
import EventPopup from './EventPopup';
var _ = require('lodash');

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
    // Day chosen by user
    // chosenDay: 0,       // choose first day by default
    // Time chosen by user
    // chosenTime: null,
    selectedIndex: 1
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

  // chooseDay = (day) => {
  //   this.setState({
  //     chosenDay: day,
  //   });
  // }

  // chooseTime = (time) => {
  //   this.setState({
  //     chosenTime: time,
  //   });
  // }

  bookEvent = () => {
    // Make sure they selected time 
    // if (!this.state.chosenTime) {
    //   alert('Please select show time');
    // } else {
      // Close popup
      this.closeEvent();
      const { navigate } = this.props.navigation;
      navigate('Confirmation', {
        event: this.state.event,
        participant: this.props.navigation.state.params.person
      }); // , { code: Math.random().toString(36).substring(6).toUpperCase() }
      
    // }
  }

   render() {
    const { events, loading, refresh } = this.props;
    const { person } =  this.props.navigation.state.params;

    return (

      <View style={styles.container}>

        <SegmentedControlIOS 
          values={['My events', 'Find event']}
          selectedIndex={this.state.selectedIndex}
          onChange={(event) => {
            this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
          }}
        />
       
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
                  if (  typeof event.participants !== 'undefined' && event.participants.length > 0 &&  _.map(event.participants, '_id').indexOf(person._id) > -1 ) { 
                    return <EventPoster
                      event={event}
                      onOpen={this.openEvent}
                      key={index}
                    /> 
                  }  
                } else {
                  return <EventPoster
                    event={event}
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
          person={person}
          isOpen={this.state.popupIsOpen}
          onClose={this.closeEvent}
          onBook={this.bookEvent}
        />

        
      </View>
      
    );
  }

}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,                // take up all screen
    paddingTop: 20,         // start below status bar
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
});