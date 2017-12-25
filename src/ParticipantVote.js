import React, { PureComponent, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';


export default class ParticipantVote extends PureComponent {

  static propTypes = {
    // Comment object shape
    participant: PropTypes.shape({
      //   content: PropTypes.string.isRequired,
      //   created: PropTypes.string.isRequired,
      //   // User object shape
      //   user: PropTypes.shape({
      name: PropTypes.string.isRequired,
      avatar: PropTypes.string.isRequired,

      //   }).isRequired,
    }).isRequired,
  };

  render() {
    // Pull comment object out of props
    const { participant, onSelected } = this.props;
    // Pull data needed to display a comment out of comment object
    // const { content, created, user } = participant;
    // Pull user name and avatar out of user object
    const { name, avatar, likes } = participant; // user;

    return (
      <View style={styles.container} >
        <TouchableOpacity onPress={() => onSelected(participant)}>
          <View style={styles.avatarContainer}>
            {avatar && <Image
              resizeMode='contain'
              style={styles.avatar}
              source={{ uri: avatar }}
            />}
          </View>
          <View >
            <Text style={[styles.text, styles.name]}> {name} </Text>
          </View>
          <View >
            <Text style={[styles.text, styles.name]}> {JSON.stringify(likes)} </Text>
          </View>

        </TouchableOpacity>

      </View>
    );
  }

}

const styles = StyleSheet.create({

});
