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



export default class VotingPushScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
       <Text> Screen with all results of voting ready to push - user screen</Text>
       
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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




//  <View style={styles.container}>
//           <ScrollView
//             ref={(scrollView) => { this._scrollView = scrollView; }}  
//           >
//             {event.participants.map((participant, index) => <Participant participant={participant} key={index}  onSelected={this.onSelected}/>)}
//           </ScrollView>

//           <TouchableHighlight
//               underlayColor="#9575CD"
//               style={styles.buttonContainer}
//               onPress={this.start}
//               >
//               <Text style={styles.button}>Send results</Text>
//           </TouchableHighlight> 
//       </View> 