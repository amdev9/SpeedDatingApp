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
  Image
} from 'react-native';
import { defaultStyles } from './styles';
import Icon from 'react-native-vector-icons/Ionicons';

export default class VotingScreen extends Component {
  
  onClicked = () => {
    const { 
      participant, 
      person 
    } = this.props.navigation.state.params;
    if (!person.likes) {
      person.likes = {
        person_id: person._id,
        person_likes: []
      };
    }
    person.likes.person_likes.push(participant._id);
  }

  
  render() {
    const { 
      participant, 
      person 
    } = this.props.navigation.state.params;

    // view with person info
    // pass here array with all users

    // {
    //   oauth_id: {
    //     type: String,
    //     unique: true,
    //     index: true,
    //   },
    //   name     : String,
    //   avatar   : String,
    //   age      : Number,
    //   gender   : Number,  // (0-girl, 1-man)
    //   organizer_status : Boolean,
    //   likes: Array,   // <------------------------------------
    //   events : [{ type: Schema.Types.ObjectId, ref: 'DateEvent' }]
    // }

    return (
       <View style={styles.container}>
        <View style={styles.content}>
          <Text> Voting user screen - say hello to participant </Text>
          <View style={styles.avatar}>
            <Image source={{ uri: participant.avatar }} style={styles.avatarImage} />
          </View>
          <Text style={styles.text}>
             {participant.name} 
          </Text>
          <TouchableOpacity onPress={this.onClicked}>
            <Icon name="ios-heart" size={30} color="#4F8EF7" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});
