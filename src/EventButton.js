
       
import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import {
  Animated,
  Dimensions,
  Image,
  LayoutAnimation,
  PanResponder,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import { defaultStyles } from './styles';
 

// Get screen dimensions
const { width, height } = Dimensions.get('window');
// Set default popup height to 67% of screen height
const defaultHeight = height * 0.67;

export default class EventButton extends Component {
    render() {
        const { event, person, onBook, onManage, onJoin } = this.props;
        
        // debug version
        if( event.organizer._id != person._id ) 
        // right version
        //  if( event.organizer._id == person._id ) 
        {
            return <TouchableHighlight
                underlayColor="#9575CD"
                style={styles.buttonContainer}
                onPress={onManage}
                >
                <Text style={styles.button}>Manage this event</Text>
                </TouchableHighlight> 

        } else if ( (typeof event.participants !== 'undefined' && event.participants.length == 0)  || (typeof event.participants !== 'undefined' && event.participants.length > 0 &&  _.map(event.participants, '_id').indexOf(person._id) == -1)   ) 
        {
            return <TouchableHighlight
                underlayColor="#9575CD"
                style={styles.buttonContainer}
                onPress={onBook}
                >
                <Text style={styles.button}>Book My Tickets</Text>
                </TouchableHighlight> 

        } else {
            return <View>
                <Text style={styles.footer}> Already attend </ Text>

                <TouchableHighlight
                underlayColor="#9575CD"
                style={styles.buttonContainer}
                onPress={onJoin}
                >
                <Text style={styles.button}>Join event room</Text>
                </TouchableHighlight> 

              </View>
        }
    }
}

const styles = StyleSheet.create({
  // Main container
  container: {
    ...StyleSheet.absoluteFillObject,   // fill up all screen
    justifyContent: 'flex-end',         // align popup at the bottom
    backgroundColor: 'transparent',     // transparent background
  },
  // Semi-transparent background below popup
  backdrop: {
    ...StyleSheet.absoluteFillObject,   // fill up all screen
    backgroundColor: 'black',
  },
  // Popup
  modal: {
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    margin: 20,
    marginBottom: 0,
  },
  // Movie container
  movieContainer: {
    flex: 1,                            // take up all available space
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,                            // take up all available space
  },
  image: {
    borderRadius: 10,                   // rounded corners
    ...StyleSheet.absoluteFillObject,   // fill up all space in a container
  },
  movieInfo: {
    backgroundColor: 'transparent',     // looks nicier when switching to/from expanded mode
  },
  title: {
    ...defaultStyles.text,
    fontSize: 20,
  },
  genre: {
    ...defaultStyles.text,
    color: '#BBBBBB',
    fontSize: 14,
  },
  sectionHeader: {
    ...defaultStyles.text,
    color: '#AAAAAA',
  },
  // Footer
  footer: {
    padding: 20,
  },
  buttonContainer: {
    backgroundColor: '#673AB7',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  button: {
    ...defaultStyles.text,
    color: '#FFFFFF',
    fontSize: 18,
  },
});

