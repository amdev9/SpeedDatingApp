import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { defaultStyles } from '../../styles';

export default class Sticker extends Component {
    render() {
      const { value } = this.props;
      
      if (value) {
        return <View
          underlayColor="#9575CD"
          style={styles.buttonContainer}
        > 
          <Text style={styles.places}> {'Организатор'} </Text>
        </View>
      } else {
        return <Text></Text>
      }
      
    }
}

const styles = StyleSheet.create({
 
  places: {
    ...defaultStyles.text,
    fontSize: 11,
    // fontWeight: 'bold',
    // marginTop: placesHeight,
    // marginLeft: 15,
    marginTop: 1,
    color: 'white',//'#3f88fb',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  buttonContainer: {
    marginTop: 15,
    marginRight: 15,
    // height: 30,
    // width: 80,
    alignItems: 'center',
    // flexDirection: 'row',
    backgroundColor: '#3f88fb', // 3f88fb
    borderRadius: 3,
    // marginRight: 15
    // marginLeft: 200,
    // paddingVertical: 10,
    // paddingHorizontal: 30,
  },
});
