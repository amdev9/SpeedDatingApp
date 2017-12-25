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
    current_user: state.current_user,
    vote_selected: state.vote_selected
  }),
  dispatch => ({
    likes_func: (person_id, event_id, likes) => dispatch(likesFunc(person_id, event_id, likes)),
  }),
)
export default class VotingPushScreen extends Component {
  constructor(props) {
    super(props);
    const { current_user } = props;
    this.state = {
      liked: current_user.likes && current_user.likes.person_likes
    }
  }

  onLiked = (participant) => {
    if (!this.state.liked.includes(participant._id)) {
      this.state.liked.push(participant._id)
    } else {
      var index = this.state.liked.indexOf(participant._id);
      this.state.liked.splice(index, 1);
    }
  };

  onConfirm = async () => {
    const { current_user } = this.props;
    const { event } = this.props.navigation.state.params;
    try {
      this.props.likes_func(current_user._id, event._id, this.state.liked);

      const { navigate } = this.props.navigation;
      navigate('ScrollTab', {
        paramm: 2
      });
      // this.props.clear_admin_matches();
    }
    catch (error) {
      alert(error);
    }
  };

  render() {
    const { current_user, vote_selected } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView; }}
        >
          {vote_selected.map((participant, index) => <Participant vision={'votepush'} participant={participant} key={index} onSelected={this.onLiked} liked={this.state.liked} />)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
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
