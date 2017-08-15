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
  TextInput,
  RefreshControl
} from 'react-native';
import { defaultStyles } from './styles';

import Participant from './Participant';

export default class JoinScreen extends Component {
  //   --main ws--
  // [  JoinScreen -> voting screen -> votingpushscreen  ] -> 'confirm' -> empty mymatches (waiting for admin 'done')
  
  state = {
    selected: [], // get from websocket
    // participant: {},
    index: 0
  };
 
  onOpenConnection = () => {
    console.log(' - onopen - ');
    // send that user connected 
    var connected = JSON.stringify({
      command: "connected",
      data: this.props.navigation.state.params.person
    });
    this.ws.send(connected);
  }

  onMessageRecieved = (e) => {
    console.log(e.data);
    var obj = JSON.parse(e.data); 
    
    // if (obj.type == 'selected') {
    //   var selected_data = JSON.parse(obj.data);
    //   // 3. remove from selected_data - person object with current person._id
    //   this.setState({
    //     selected: selected_data
    //   })
    // }

    if (obj.type == 'next') {
      // 4. 
      // pass from backend next with current participant
      var participant = JSON.parse(obj.data);
      for (var i = 0; i < participant.length; i++) {
        if (participant[i]._id == this.props.navigation.state.params.person._id) {
          participant.splice(i, 1); 
          break;
        }
      }

      this.setState({
        participant: participant[this.state.index]
      })
      const { navigate } = this.props.navigation;
      navigate('Voting', {
        participant: this.state.participant,// this.state.selected[this.state.index], 
        person: this.props.navigation.state.params.person
      });  
      this.state.index++;
    }

    if (obj.type == 'last') {
      var selected_data = JSON.parse(obj.data);
      // 3. remove from selected_data - person object with current person._id
      this.setState({
        selected: selected_data
      });
      const { navigate } = this.props.navigation;
      navigate('VotePush', {
        participants: this.state.selected,  
        person: this.props.navigation.state.params.person,
        event: this.props.navigation.state.params.event
      });  
    }
  };

  onError = (e) => {
    console.log(e.message);
  };

  onClose = (e) => {
    console.log(e.code, e.reason);
    // send that user connected 
    var closed = JSON.stringify({
      command: "closed",
      data: this.props.navigation.state.params.person
    });
    this.ws.send(closed);

  };

  componentWillMount() {
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.onopen = this.onOpenConnection;
    this.ws.onmessage = this.onMessageRecieved;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }

    
  render() {

    const { person } =  this.props.navigation.state.params;     
    return (
      <View style={styles.container}>
         <Text > Join screen </Text>
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
