import React, { Component, PropTypes } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { defaultStyles } from '../styles';

export default class Cost extends Component {
    render() {
      const { value } = this.props;
      
      return  <View
          underlayColor="#9575CD"
          style={styles.buttonContainer}
      >
        <Text style={styles.places}>{value}</Text>
        <Icon style={styles.iconic} name="ruble" size={15} color="#FFF" />
      </View> 

        
      
    }
}

const styles = StyleSheet.create({
  iconic: {
    marginLeft: 5,
    // marginTop: 7,
  },
  places: {
    ...defaultStyles.text,
    fontSize: 14,
    fontWeight: 'bold',
    // marginTop: placesHeight,
    marginLeft: 25,
    // marginTop: 7,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  buttonContainer: {
    marginTop: 16,
    height: 30,
    width: 100,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f4c745', // 3f88fb
    borderRadius: 100,
    marginRight: 15
    // marginLeft: 200,
    // paddingVertical: 10,
    // paddingHorizontal: 30,
  },
});

