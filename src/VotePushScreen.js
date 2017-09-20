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
  AsyncStorage
} from 'react-native';


import { defaultStyles } from './styles';
import Participant from './Participant';
import { put, get } from '../components/api';


export default class VotingPushScreen extends Component {
  // votingpushscreen  -> 'confirm' -> empty mymatches (waiting for admin 'done')
  constructor(props) {
    super(props);
    const { person, participants } = this.props.navigation.state.params;
    this.state = {
      liked: person.likes.person_likes
    }
  }
  
  onLiked = (participant) => {
    if( !this.state.liked.includes(participant._id) ) {
      this.state.liked.push(participant._id)
    } else {
      var index = this.state.liked.indexOf(participant._id);
      this.state.liked.splice(index, 1);
    }
  };
 
  onConfirm = async () => {
    const { person, participants, event } = this.props.navigation.state.params;
    try {
      // Make API call
      const response = await put('likes', {
        person_id: person._id,
        likes: this.state.liked,
        event_id: event._id
      }); 
      const json = await response.json();
      console.log(json);
      const { navigate } = this.props.navigation;
      
      
      navigate('ScrollTab', {
        paramm: 2
      }); // Mymatches tab

      // 'Mymatches', {
      //   person: person
      // });
    }
    catch (error) {
      alert(error);
    }
  };

  render() {
    const { person, participants } = this.props.navigation.state.params;
    //this.onClicked
    // remove from participants
    _.remove(participants, { '_id': person._id }); 
    return (
      <View style={styles.container}>
        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView; }}  
        >
          {participants.map((participant, index) => <Participant vision={'votepush'} participant={participant} key={index} onSelected={this.onLiked} liked={this.state.liked}/>)}
        </ScrollView>
        <TouchableHighlight
          underlayColor="#9575CD"
          style={styles.buttonContainer}
          onPress={this.onConfirm}
        >
          <Text style={styles.button}>Отправить</Text>
        </TouchableHighlight> 
      </View>
    );
  }
}

{/* underlayColor="#9575CD" */}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
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
    backgroundColor: '#3f88fb',
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
