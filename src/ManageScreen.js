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

export default class ManageScreen extends Component {
  state = {
    selected: []
  };
  
  onOpenConnection = () => {
    console.log(' - onopen - ');
    // ws.send('start'); // send a message
  }

  onMessageRecieved = (e) => {
    // a message was received
    console.log(e.data);
    if (e.data == 'last') {
      const { navigate } = this.props.navigation;
      navigate('VotePush', {
        participants: this.state.selected
      });  
    }
  };

  onError = (e) => {
    // an error occurred
    console.log(e.message);
  };

  onClose = (e) => {
    // connection closed
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
    console.log('start with: ', this.state.selected);
    // make post request to server
    // navigate to voting status screen

    let json = JSON.stringify({
      command: "start",
      timeout: 10,
      talk_time: 20,
      count_pair: 1
    });
    this.ws.send(json);


    if (this.state.selected.length > 0) {
      const { navigate } = this.props.navigation;
      
      navigate('Voting', {
        participants: this.state.selected
      }); 

      // navigate('VotingStatus', {
      //   final_participants: this.state.selected
      // }); 
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

          <TouchableHighlight
              underlayColor="#9575CD"
              style={styles.buttonContainer}
              onPress={this.start}
              >
              <Text style={styles.button}>Start</Text>
          </TouchableHighlight> 
      </View>
    );


    //    refreshControl={
    //                 <RefreshControl
    //                 refreshing={this.state.refreshing}
    //                 onRefresh={this.onRefresh}
    //                 />
    //             }


    //      <ListView
    //     dataSource={this.state.dataSource}
    //     renderRow={(rowData) => <Text>{rowData}</Text>}
    //   />
    //  );
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
