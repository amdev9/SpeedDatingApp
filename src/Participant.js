import React, { PureComponent, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
 

export default class Participant extends PureComponent {

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
    const { participant } = this.props;
    // Pull data needed to display a comment out of comment object
    // const { content, created, user } = participant;
    // Pull user name and avatar out of user object
    const { name, avatar } = participant; // user;
    return (
      <View style={styles.container}>
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
       
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  avatarContainer: {
    alignItems: 'center',
    marginLeft: 5,
    paddingTop: 10,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    padding: 5,
  },
  avatar: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 13,
    width: 26,
    height: 26,
  },
  text: {
    color: '#000',
    fontFamily: 'Avenir',
    fontSize: 15,
  },
  name: {
    fontWeight: 'bold',
  },
  created: {
    color: '#BBB',
  },
});




        //   <Text>
        //     <Text >{name}</Text>
        //     {' '}
           
        //      <Text style={styles.text}>content</Text> 
        //   </Text>
          
