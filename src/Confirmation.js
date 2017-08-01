import React, { Component } from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { defaultStyles } from './styles';

import { put, get } from '../components/api';
export default class Confirmation extends Component {


  _finalBookEvent = async () => {
    const { event, participant } = this.props.navigation.state.params;
    // this._scrollView.scrollTo({ y: 0 });
    try {
      // Make API call
      const response = await put('events', {
        event_id: event._id,
        participant_id: participant._id,
      }); 

      // console.log(event._id,  participant._id)
      // Convert response to JSON
      const json = await response.json();
      console.log(json);
       
      // this.props.navigation.navigate('Events')
      // , {
        // event: json
      // }

    }
    catch (error) {
      alert(error);
    }
  };
  
  render() {
    const { event, participant } = this.props.navigation.state.params;
    const { goBack } = this.props.navigation;
    
     
    if ((typeof event.participants !== 'undefined' && event.participants.length == 0)  || (typeof event.participants !== 'undefined' && event.participants.length > 0 &&  _.map(event.participants, '_id').indexOf(participant._id) == -1) ) {
      return (
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.buttonContainer}
            // Go back when pressed
            onPress={() => this._finalBookEvent()} // add to event participants current person profile
          >
        <Text style={styles.button}>Final Book Event</Text>
        </TouchableOpacity>
            <TouchableOpacity
             style={styles.buttonContainer}
             onPress={() => goBack()}  
             >
         <Text style={styles.button}>Done</Text>
        </TouchableOpacity>
      </View>
            )
             
    } else {
            return (
             <View style={styles.container}>
               <Text> Already attended to event </Text>
            <TouchableOpacity
          style={styles.buttonContainer}
          // Go back when pressed
          onPress={() => goBack()}  
        >
          <Text style={styles.button}>Done</Text>
        </TouchableOpacity>
      </View>
            )

             
          }
    }

    // else manage event
         
      
  
        
    
    
  }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...defaultStyles.text,
    color: '#333',
    fontSize: 20,
  },
  code: {
    ...defaultStyles.text,
    color: '#333',
    fontSize: 36,
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#673AB7',
    borderRadius: 100,
    margin: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  button: {
    ...defaultStyles.text,
    color: '#FFFFFF',
    fontSize: 18,
  },
});