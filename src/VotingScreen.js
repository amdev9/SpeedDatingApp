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
  RefreshControl,
  Image
} from 'react-native';
import { defaultStyles } from './styles';

// var ws = new WebSocket('ws://localhost:3000');

// ws.onopen = () => {
//   // connection opened
//   console.log(' - onopen - ');
//   // ws.send('start'); // send a message
// };

// ws.onmessage = (e) => {
//   // a message was received
//   console.log(e.data);

//   if (e.data == 'last') {
//     console.log('navigate to votingpushscreen');
//   }
// };

// ws.onerror = (e) => {
//   // an error occurred
//   console.log(e.message);
// };

// ws.onclose = (e) => {
//   // connection closed
//   console.log(e.code, e.reason);
// };

export default class VotingScreen extends Component {
   
  render() {
    const { participants } = this.props.navigation.state.params;
    // view with person info
    // pass here array with all users
    return (
       <View style={styles.container}>
        <View style={styles.content}>

          <Text> Voting user screen - say hello to participant </Text>
          <View style={styles.avatar}>
            <Image source={{ uri: participants[0].avatar }} style={styles.avatarImage} />
          </View>
          <Text style={styles.text}>
             {participants[0].name} 
          </Text>

          
           
        </View>
      </View>
    );

    
    
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});
