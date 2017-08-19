import React, { Component, PropTypes } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { defaultStyles } from './styles';


// Get screen dimensions
const { width, height } = Dimensions.get('window');
// How many posters we want to have in each row and column
const cols = 3, rows = 4;

export default class EventPoster extends Component {
  // Component prop types
  static propTypes = {
    // Movie object with title, genre, and poster
    event: PropTypes.object.isRequired,
    // Called when user taps on a poster
    onOpen: PropTypes.func.isRequired,
  }
  render() {
    const { event, event: { title, genre, photo }, onOpen } = this.props;
    return (
      <TouchableOpacity style={styles.container} onPress={() => onOpen(event)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo }} style={styles.image} />
          
          <View style={styles.overlay} />
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        
        {/* <Text style={styles.genre} numberOfLines={1}>{genre}</Text> */}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginBottom: 20,
    height: (height - 20 - 20) / rows - 10,
    width: (width - 40) /// cols - 10,
  },
  imageContainer: {
    flex: 1,                          // take up all available space
  },
  image: {
    borderRadius: 5,                 // rounded corners
    ...StyleSheet.absoluteFillObject, // fill up all space in a container
  },
  overlay: {
    borderRadius: 5,   
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  title: {
    ...defaultStyles.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 120,
    marginLeft: 10,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  genre: {
    ...defaultStyles.text,
    color: '#BBBBBB',
    fontSize: 12,
    lineHeight: 14,
  },
});