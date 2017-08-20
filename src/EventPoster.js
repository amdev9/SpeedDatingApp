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
import LinearGradient from 'react-native-linear-gradient';

import Places from './widgets/Places';
import Sticker from './widgets/Sticker';
import Cost from './widgets/Cost';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
// How many posters we want to have in each row and column
const cols = 3, rows = 4;

export default class EventPoster extends Component {
  // Component prop types
  static propTypes = {
    // Movie object with title, genre, and poster
    event: PropTypes.object.isRequired,
    person: PropTypes.object.isRequired,
    // Called when user taps on a poster
    onOpen: PropTypes.func.isRequired,
  }
  render() {
    const { person, event, person: { gender }, event: { title, date, places_max, cost_men, cost_women, show_manage, photo, participant_ids }, onOpen } = this.props;
    if (gender == 1) {
      var cost = cost_women;
    } else if (gender == 2) {
      var cost = cost_men;
    }
    var left_places = places_max - participant_ids.length;
    return (
      <TouchableOpacity style={styles.container} onPress={() => onOpen(event)}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: photo }} style={styles.image} />
            {/* <View style={styles.overlay} /> */}
            <LinearGradient  start={{x: 0.0, y: 0.1}} end={{x: 1.0, y: 0.6}}
              locations={[0,0.3,0.7]}
                colors={[ 'rgba(63, 136, 251, 0.8)', 'rgba(85, 149, 252, 0.8)', 'rgba(79, 69, 100, 0.8)']}
                  style={styles.overlay} />

          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.date}>{date}</Text>
          <Places style={styles.places} value={left_places} />
          <Sticker style={styles.sticker} value={show_manage} />
          <Cost style={styles.cost} value={cost} /> 
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
  // WIDGETS
  title: {
    ...defaultStyles.text,
    fontSize: 15,
    // fontWeight: 'bold',
    marginTop: 10,//(height - 20 - 20) / rows - 10 - 25,
    marginLeft: 10,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  date: {

  },
  places: {

  },
  sticker: {

  },
  cost: {

  },
  // genre: {
  //   ...defaultStyles.text,
  //   color: '#BBBBBB',
  //   fontSize: 12,
  //   lineHeight: 14,
  // },
  imageContainer: {
    flex: 1,                          // take up all available space
  },
  image: {
    borderRadius: 5,                 // rounded corners
    ...StyleSheet.absoluteFillObject, // fill up all space in a container
  },
  overlay: {
    borderRadius: 5,   
    ...StyleSheet.absoluteFillObject, // backgroundColor: 'rgba(63, 136, 251, 0.6)' // 63, 136, 251, 1
  }
});