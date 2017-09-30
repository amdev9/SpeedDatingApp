import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl
} from 'react-native';

import EventPoster from './EventPoster';



export default class ScrollViewElements extends Component {
  render() {
    const { selected, events, user, onOpenEvent, loading, refresh } = this.props;
    let elements = [];
    let counter = 0;

    if (selected == 0) { 
      noEventsText = 'Нет моих мероприятий';
      elements = events.map((event, index) => {
        if (event.participant_ids.includes(user._id)) {  
          return <EventPoster
            event={event} 
            person={user}
            onOpen={onOpenEvent}
            key={index}
          /> 
        } else {
          counter++;
        } 
      });
    } else {
      noEventsText = 'Нет активных мероприятий';
      elements = events.map((event, index) => {
        return <EventPoster
          event={event} 
          person={user}
          onOpen={onOpenEvent}
          key={index}
        /> 
      });
    }
    
    return <ScrollView 
      contentContainerStyle={styles.scrollContent}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      refreshControl={ <RefreshControl refreshing={loading} onRefresh={refresh} /> }
    >
      { counter == events.length ? <View style={styles.nocontainer}><Text style={styles.noevents}>{noEventsText}</Text></View> : elements }
    </ScrollView>
  
  }
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 20, 
    flexDirection: 'row',   // arrange posters in rows
    flexWrap: 'wrap',       // allow multiple rows
  },
  noevents: { 
    fontWeight: 'bold',
    fontSize: 18,
    color: '#3f88fb'
  },
  nocontainer: { 
    flex: 1, 
    alignItems: 'center',     // center horizontally
    justifyContent: 'center', // center vertically
  }


});



