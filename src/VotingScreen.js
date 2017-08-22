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
  
  constructor(props) {
    super(props);
    const { person, participants } = this.props.navigation.state.params;
    if (!person.likes) {
      person.likes = {
        person_id: person._id,
        person_likes: []
      };
    }
  }
  
  onClicked = () => {
    const { 
      participant, 
      person 
    } = this.props.navigation.state.params;
    console.log(participant._id)
    person.likes.person_likes.push(participant._id); 
  }

  render() {
    const { 
      participant, 
      person 
    } = this.props.navigation.state.params;
    const { avatar, name } = participant;



    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.avatar}>
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          </View>
          <Text style={styles.text}>{name}</Text>
        </View>
        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={this.onClicked}>
          <Text style={styles.button}>Like</Text>
        </TouchableHighlight> 
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
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },


  // like
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
