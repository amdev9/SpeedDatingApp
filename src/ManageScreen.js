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

export default class ManageScreen extends Component {
  //   --main ws--
  // [ ManageScreen -> 'start' -> VotingStatusScreen ] -> MatchScreen

  state = {
    selected: [],
    index: 0,
    talk_time: '4'
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

      const { navigate } = this.props.navigation;
      navigate('VotingStatus', {
        participants: this.state.selected,
        person: this.props.navigation.state.params.person
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

  start = () => {
    if (this.state.selected.length > 0) {
      let json = JSON.stringify({
        command: "start",
        timeout: 2,
        talk_time: parseInt(this.state.talk_time),
        selected: JSON.stringify(this.state.selected) // .length // send selected id
      });
      this.ws.send(json);
    } else {
      alert('Select participants to start')
    }
  }

  onSelected = (participant) => {
    if(!_.includes(this.state.selected, participant)) {
      this.state.selected.push(participant)
    } else {
      _.remove(this.state.selected, participant);
    }
  }

  render() {
    
    const { event } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
          <ScrollView
            ref={(scrollView) => { this._scrollView = scrollView; }}  
          >
            {event.participants.map((participant, index) => <Participant participant={participant} key={index}  onSelected={this.onSelected}/>)}
          </ScrollView>

          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            keyboardType= {'numeric'}
            onChangeText={(text) => this.setState({ text })}
            value={this.state.talk_time}
          />
          
          <TouchableHighlight
              underlayColor="#9575CD"
              style={styles.buttonContainer}
              onPress={this.start}
              >
              <Text style={styles.button}>Start</Text>
          </TouchableHighlight> 
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
