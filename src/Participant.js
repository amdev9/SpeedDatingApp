import React, { PureComponent, PropTypes } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Participant extends PureComponent {
  constructor(props) {
    super(props);
    if (this.props.liked && this.props.liked.includes(this.props.participant._id)) {
      this.state = { pressStatus: true };
    } else {
      this.state = { pressStatus: false };
    }
    //console.log('participant, liked ',participant, liked)
    
  }

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
    const { participant, onSelected, liked, vision } = this.props;
    // Pull data needed to display a comment out of comment object
    // const { content, created, user } = participant;
    // Pull user name and avatar out of user object
    const { name, avatar } = participant; // user; {backgroundColor: 'blue', flex: 0.3}

    if (vision == 'mymatch_horizontal') {

      return <TouchableOpacity onPress={ () => { 
          onSelected(participant); 
          this.setState({
            pressStatus: !this.state.pressStatus
          });
        } 
      }>
        <View style={styles.col_hor}>
          <View style={styles.avatarContainer_hor} > 
            {avatar && <Image
              resizeMode='contain'
              style={styles.avatar}
              source={{ uri: avatar }}
            />}
          </View>
          <View style={styles.textContainer_hor}>
            <Text style={styles.text_hor}> {name} </Text>
          </View>
        </View>
      </TouchableOpacity>

    } else if (vision == 'mymatch_vertical') {
      return <TouchableOpacity onPress={ () => { 
          onSelected(participant); 
          this.setState({
            pressStatus: !this.state.pressStatus
          });
        } 
      }>
        <View style={styles.col}>
          <View style={styles.avatarContainer} > 
            {avatar && <Image
              resizeMode='contain'
              style={styles.avatar}
              source={{ uri: avatar }}
            />}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.text}> {name} </Text>
          </View>
        </View>
      </TouchableOpacity>
    } else if (vision == 'votepush') {
      return (
        <View style={ this.state.pressStatus ? styles.containerPress : styles.container  } >
          <TouchableOpacity onPress={ () => { 
              onSelected(participant); 
              this.setState({
                pressStatus: !this.state.pressStatus
              });
            } 
          }>
            <View style={styles.col}>
              <View style={styles.avatarContainer} > 
                {avatar && <Image
                  resizeMode='contain'
                  style={styles.avatar}
                  source={{ uri: avatar }}
                />}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}> {name} </Text>
              </View>
              <TouchableOpacity onPress={this.onLiked}> 
                <Icon name="ios-heart" size={30} color="#4F8EF7" />
              </TouchableOpacity>  
            </View>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={ this.state.pressStatus ? styles.containerPress : styles.container  } >
          <TouchableOpacity onPress={ () => { 
              onSelected(participant); 
              this.setState({
                pressStatus: !this.state.pressStatus
              });
            } 
          }>
            <View style={styles.col}>
              <View style={styles.avatarContainer} > 
                {avatar && <Image
                  resizeMode='contain'
                  style={styles.avatar}
                  source={{ uri: avatar }}
                />}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.text}> {name} </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  col_hor: {
    flexDirection: 'column',
    width: 80,
  },
  avatarContainer_hor: {        
    alignItems: 'center',
    // marginLeft: 8,
    marginTop: 5,
   
    height: 60
  },
  text_hor: {
    color: '#000',
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5
  },
  textContainer_hor: {
    alignItems: 'center',
    // width: 80,
    // height: 60,
    // marginLeft: 15
  },

  //////////////////
  col: {
    flex: 1,
    flexDirection: 'row',
    margin: 10
  },
  container: {
    // flexDirection: 'row',
  },
  containerPress: {
    // flexDirection: 'row',
    backgroundColor: 'blue',
  },
  avatar: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  avatarContainer: {        
    alignItems: 'center',
    // marginLeft: 5,
    // paddingTop: 10,
    width: 60,
    height: 60
  },
  text: {
    color: '#000',
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20
  },
  textContainer: {
    width: 120,
    height: 60,
    marginLeft: 15
  },
});

