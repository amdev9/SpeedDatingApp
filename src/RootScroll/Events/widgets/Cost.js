import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Iconic from 'react-native-vector-icons/Ionicons';


import { defaultStyles } from '../../../styles';

export default class Cost extends Component {
    render() {
      const { cost, part, manage } = this.props;
      
      console.log(this.props)

      if(!manage) {
        if (!part) {
          return  <View
              underlayColor="#9575CD"
              style={styles.buttonContainer}
          >
            <Text style={styles.places}>{cost}</Text>
            <Icon style={styles.iconic} name="ruble" size={15} color="#FFF" />
          </View> 
        } else {
          return  <View style={styles.buttonGo}>
            <Iconic style={styles.iconicGo} name="ios-checkmark" size={30} />
            <Text style={styles.go}>Уже иду</Text>
           
          </View> 
        }
        
      } else {
        return  <View style={styles.buttonGo}>
        {/* <Iconic style={styles.iconicGo} name="ios-checkmark" size={30} /> */}
          <Text style={styles.go}>Организатор</Text>
        </View> 
      }
      
 
    }
}

const styles = StyleSheet.create({
  iconic: {
    marginLeft: 4,
    color: '#FFFFFF',
    marginTop: 1,
  },
  iconicGo: {
    marginLeft: 10,
    color: '#FFFFFF',
    marginTop: 1,
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
    // marginTop: 16,
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
  go: {
    ...defaultStyles.text,
    fontSize: 14,
    // fontWeight: 'bold',
    // marginTop: placesHeight,
    marginLeft: 5,
    // marginTop: 7,
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0)',
  },
  buttonGo: {
    // marginTop: 16,
    height: 30,
    width: 100,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'transparent', // 3f88fb
    borderRadius: 100,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'white'
     
  },
});

