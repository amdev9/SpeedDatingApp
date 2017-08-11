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


export default class VotingStatusScreen extends Component {

 


  onLiked = (participant) => {
    // if( !this.state.liked.includes(participant._id) ) {
    //   this.state.liked.push(participant._id)
    // } else {
    //   var index = this.state.liked.indexOf(participant._id);
    //   this.state.liked.splice(index, 1);
    // }
  };


  onOpenConnection = () => {
    console.log(' - onopen - ');
  }

  onMessageRecieved = (e) => {
    console.log(e.data);
    var obj = JSON.parse(e.data); 
    if (obj.type == 'calculate') {
      const { navigate } = this.props.navigation;
      navigate('Match', {
        matches: obj.data
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

  _calculate = async () => {
    const { event } =  this.props.navigation.state.params;
    let json = JSON.stringify({
      command: "calculate",
      event_id: event._id
    });
    this.ws.send(json);
  }

  render() {
    // list with all participants - pushed results status in front of each

    const { participants } = this.props.navigation.state.params;
    
    
    return (
      <View style={styles.container}>
        <Text> Voting status screen - Manager screen</Text>
       
          {participants.map((participant, index) => <Participant participant={participant} key={index} onSelected={this.onLiked}/>)}
        <TouchableOpacity onPress={this._calculate}>
          <Text> Calculate results </Text>
        </TouchableOpacity>
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
