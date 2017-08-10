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
  // [  JoinScreen -> voting screen -> votingpushscreen  ] -> mymatches 
  
  state = {
    selected: [], // get from websocket
    index: 0
  };
 
  onOpenConnection = () => {
    console.log(' - onopen - ');
  }

  onMessageRecieved = (e) => {
    console.log(e.data);
    
    var obj = JSON.parse(e.data); 
    if (obj.type == 'selected') {
      this.setState({
        selected: JSON.parse(obj.selected)
      })
    }

    if (obj.type == 'next') {
      const { navigate } = this.props.navigation;
      navigate('Voting', {
        participant: this.state.selected[this.state.index], 
        person: this.props.navigation.state.params.person
      });  
      this.state.index++;
    }

    if (obj.type == 'last') {
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
  };

  componentWillMount() {
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.onopen = this.onOpenConnection;
    this.ws.onmessage = this.onMessageRecieved;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }

    
  render() {
    // add text field

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
