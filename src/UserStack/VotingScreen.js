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
import { defaultStyles } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';

export default class VotingScreen extends Component {
  
  constructor(props) {
    super(props);
    const { person, participants } = this.props.navigation.state.params;
    this.state = {
      liked: false
    };
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
    console.log(person.likes.person_likes)

    if(!person.likes.person_likes.includes(participant._id)) { 
      person.likes.person_likes.push(participant._id); 
    } else {
      var index = person.likes.person_likes.indexOf(participant._id);
      if (index > -1) {
        person.likes.person_likes.splice(index, 1);
      }
    }
    
    // click again to unlike
    this.setState({
      liked: !this.state.liked
    })
  }

  render() {
    const { 
      participant, 
      person 
    } = this.props.navigation.state.params;
    const { avatar, name, table } = participant;
    return (
      // add table number here
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.avatar}>
            <Image source={{ uri: avatar }} style={styles.avatarImage} />
          </View>
          <Text style={styles.text}>{name}</Text>

          <Text style={styles.text}>Table { table }</Text>
        </View>
        <TouchableHighlight
          underlayColor="#9575CD"
          style={ this.state.liked ? styles.buttonLikeContainer : styles.buttonContainer}
          onPress={this.onClicked}>
          <Text style={ this.state.liked ? styles.buttonLike : styles.button}> { this.state.liked ? 'Unlike' : 'Like' } </Text>
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
  //
  buttonLikeContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 100,
    margin: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#3f88fb',
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
  buttonLike: {
    ...defaultStyles.text,
    color: '#3f88fb',
    fontSize: 18,
  },

});
