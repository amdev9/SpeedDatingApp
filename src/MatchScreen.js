import React, { Component } from 'react';
import _ from 'lodash';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View, 
  ListView, 
  ScrollView,
  RefreshControl
} from 'react-native';
import { defaultStyles } from './styles';

import Participant from './Participant';

export default class MatchScreen extends Component {

  render() {
    const { matches } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
          <Text> { JSON.stringify(matches) }</Text> 
         {/*
            change to custom matchParticipant

            <ScrollView
              ref={(scrollView) => { this._scrollView = scrollView; }}  
            >
            { matches.map((participant, index) => {
                  return  (
                    <Participant participant={participant} key={index} />  
                  );
              })
            } 
            </ScrollView>
         */}
 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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



 