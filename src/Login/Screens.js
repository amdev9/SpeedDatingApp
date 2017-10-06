import React, { Component } from 'react';
import {
  StyleSheet,   // CSS-like styles
  Text,         // Renders text
  View,          // Container component
  Image
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
            {/* <Icon name="ios-nutrition" {...iconStyles} /> */}
            {/* <Text style={styles.header}>EAT</Text> */}
            <Text style={styles.text}>Marketing Screen 1</Text>
            {/* <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Red_Bull_Headquarters_1_%28DFdB%29.JPG/1920px-Red_Bull_Headquarters_1_%28DFdB%29.JPG' }} style={styles.image} /> */}
        </View>
        {/* Second screen 
        { backgroundColor: '#4AAFEE' } */}
        <View style={styles.slide}> 
            {/* <Icon name="ios-cloud-upload" {...iconStyles} /> */}
            {/* <Text style={styles.header}>PRAY</Text> */}
            {/* <Text style={styles.text}>Prayer is one of the most important things a Christian can do</Text> */}
            <Text style={styles.text}>Marketing Screen 2</Text>
        </View>
        {/* Third screen 
        { backgroundColor: '#FC515B' }*/}
        <View style={styles.slide}>
            {/* <Icon name="ios-heart" {...iconStyles} /> */}
            {/* <Text style={styles.header}>LOVE</Text> */}
            <Text style={styles.text}>Marketing Screen 3</Text>
        </View>
        </Swiper>
    );
  }
}

const iconStyles = {
  size: 100,
  color: '#3f88fb',
}; 

const styles = StyleSheet.create({
  // Slide styles
  // image: {
  //   ...StyleSheet.absoluteFillObject,   // fill up all space in a container
  // },
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
    color: '#3f88fb',
    fontFamily: 'System',
    // fontFamily: 'Avenir',
    fontSize: 18,
    // margin: 40,
    marginHorizontal: 40,
    textAlign: 'center',
  },
});
