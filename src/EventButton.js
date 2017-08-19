
       
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
      const { event, person, onBook, onManage, onJoin, onManageRequest } = this.props;
      if ( event.manage_ids.includes(person._id) && ( !event.participant_ids.includes(person._id)) ) 
      {
        return <TouchableHighlight
          underlayColor="#9575CD"
          style={styles.buttonContainer}
          onPress={onManage}
        >
          <Text style={styles.button}>Manage this event</Text>
        </TouchableHighlight> 
            
      } else if  ( !event.manage_queue_ids.includes(person._id) && !event.manage_ids.includes(person._id) && ( !event.participant_ids.includes(person._id)) ) {
        return  event.show_manage 
          ? 
            <View>
              <TouchableHighlight
                underlayColor="#9575CD"
                style={styles.buttonContainer}
                onPress={onBook}
              >
              <Text style={styles.button}>Book My Tickets</Text> 
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="#9575CD"
                style={styles.buttonContainer}
                onPress={onManageRequest}
              >
              <Text style={styles.button}>Became a manager of event</Text> 
              </TouchableHighlight>
            </View>
          : 
            <View>
              <TouchableHighlight
                underlayColor="#9575CD"
                style={styles.buttonContainer}
                onPress={onBook}
              >
              <Text style={styles.button}>Book My Tickets</Text> 
              </TouchableHighlight>
            </View>
        } else if  ( !event.manage_ids.includes(person._id) && ( !event.participant_ids.includes(person._id))
      && event.manage_queue_ids.includes(person._id) ) {
          return  event.show_manage 
            ? 
              <View>
                <TouchableHighlight
                  underlayColor="#9575CD"
                  style={styles.buttonContainer}
                  onPress={onBook}
                >
                <Text style={styles.button}>Book My Tickets</Text> 
                </TouchableHighlight>
                <Text style={styles.footer}>Waiting for approval</Text> 
              </View>
            : 
              <View>
                <TouchableHighlight
                  underlayColor="#9575CD"
                  style={styles.buttonContainer}
                  onPress={onBook}
                >
                <Text style={styles.button}>Book My Tickets</Text> 
                </TouchableHighlight>
              </View>
          }
        
        
        else if  ( !event.manage_ids.includes(person._id) && ( event.participant_ids.includes(person._id)) ) {
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
        } else {
          alert("Error in access rights")
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
    backgroundColor: '#3f88fb',//'#673AB7',
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

