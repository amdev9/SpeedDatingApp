import React, { Component } from 'react';


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

import { defaultStyles } from '../styles';
import Participant from '../Participant';

import _ from 'lodash';

import { connect } from 'react-redux';
import { likesFunc } from '../helpers/actions';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
    current_user: state.current_user
  }),
  dispatch => ({
    likesPost: (person_id, event_id, likes) => dispatch(likesFunc(person_id, event_id, likes)), 
  }),
)
export default class VotingPushScreen extends Component {
  // votingpushscreen  -> 'confirm' -> empty mymatches (waiting for admin 'done')
  constructor(props) {
    super(props);
    const { current_user } = this.props;
    const { participants } = this.props.navigation.state.params;
    this.state = {
      liked: current_user.likes.person_likes
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
    const {current_user} =this.props;
    const { participants, event } = this.props.navigation.state.params;
    try {
     
      this.props.likesPost(current_user._id, event._id, this.state.liked);
    
      const { navigate } = this.props.navigation;
    
      navigate('ScrollTab', {
        paramm: 2
      }); 
    }
    catch (error) {
      alert(error);
    }
  };

  render() {
    const {current_user} = this.props;
    const { participants } = this.props.navigation.state.params;

    _.remove(participants, { '_id': current_user._id }); 
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
