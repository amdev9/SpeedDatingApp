import React, { Component } from 'react';
import {
  StyleSheet,   // CSS-like styles
  Text,         // Renders text
  View          // Container component
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from './Swiper';

export default class Screens extends Component {
  render() {
    
    return (
        <Swiper>
        {/* First screen 
        { backgroundColor: '#C04DEE' }*/}
        <View style={styles.slide}>
            <Icon name="ios-nutrition" {...iconStyles} />
            {/* <Text style={styles.header}>EAT</Text> */}
            <Text style={styles.text}>Good nutrition is an important part of leading a healthy lifestyle</Text>
        </View>
        {/* Second screen 
        { backgroundColor: '#4AAFEE' } */}
        <View style={styles.slide}> 
            <Icon name="ios-cloud-upload" {...iconStyles} />
            {/* <Text style={styles.header}>PRAY</Text> */}
            <Text style={styles.text}>Prayer is one of the most important things a Christian can do</Text>
        </View>
        {/* Third screen 
        { backgroundColor: '#FC515B' }*/}
        <View style={styles.slide}>
            <Icon name="ios-heart" {...iconStyles} />
            {/* <Text style={styles.header}>LOVE</Text> */}
            <Text style={styles.text}>Where there is love there is life</Text>
        </View>
        </Swiper>
    );
  }
}

const iconStyles = {
  size: 100,
  color: '#FE5068',
}; 

const styles = StyleSheet.create({
  // Slide styles
  slide: {
    flex: 1,                    // Take up all screen
    justifyContent: 'center',   // Center vertically
    alignItems: 'center',       // Center horizontally
  },
  // Header styles
  header: {
    color: '#FE5068',
    fontFamily: 'Avenir',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  // Text below header
  text: {
    color: '#FE5068',
    fontFamily: 'Avenir',
    fontSize: 18,
    // margin: 40,
    marginHorizontal: 40,
    textAlign: 'center',
  },
});
