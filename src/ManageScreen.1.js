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

  start = () => {
    console.log('start with: ', this.state.selected);
    // make post request to server
    // navigate to voting status screen

    if (this.state.selected.length > 0) {
      const { navigate } = this.props.navigation;
      navigate('VotingStatus', {
        final_participants: this.state.selected
      }); 
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
