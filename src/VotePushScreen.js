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
import { put, get } from '../components/api';


export default class VotingPushScreen extends Component {

  // send results to server -> go to mymatches screen

  constructor(props) {
    super(props);
    const { person, participants } = this.props.navigation.state.params;
    this.state = {
      liked: person.likes
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
      navigate('Mymatches'); 

    }
    catch (error) {
      alert(error);
    }
  };



  render() {
    const { person, participants } = this.props.navigation.state.params;
    return (
       <View style={styles.container}>
          <ScrollView
            ref={(scrollView) => { this._scrollView = scrollView; }}  
          >
            {participants.map((participant, index) => <Participant participant={participant} key={index} onSelected={this.onLiked}/>)}
          </ScrollView>

           
          <TouchableHighlight
              underlayColor="#9575CD"
              style={styles.buttonContainer}
              onPress={this.onConfirm}
              >
              <Text style={styles.button}>Confirm</Text>
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
