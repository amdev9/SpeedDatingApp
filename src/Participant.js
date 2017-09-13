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
          // change to ios-heart
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
            <Text style={styles.text_hor}>{name}</Text>
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
            <Text style={styles.text}>{name}</Text>
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
              <View style={[styles.avatarContainer, {
                marginLeft: 20,
              }]} > 
                {avatar && <Image
                  resizeMode='contain'
                  style={styles.avatar}
                  source={{ uri: avatar }}
                />}
              </View>
              <View style={styles.textContainer}> 
                <Text style={ this.state.pressStatus ? styles.textLiked : styles.text}> {name} </Text>
              </View>
              <View style={styles.iconic}>
                { this.state.pressStatus ? <Icon name="ios-heart" size={30} color="#f2aab8" /> : <Icon name="ios-heart-outline" size={30} color="#4F8EF7" /> }
              </View>
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
                <Text style={styles.text}>{name}</Text>
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
   
    height: 78
  },
  text_hor: {
    color: '#474747',
    
    // fontFamily: 'System',
    fontFamily: 'ProximaNova-Semibold', //'System',
    fontSize: 17,
    // fontWeight: 'bold',
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
    backgroundColor: '#3f88fb',
  },
  avatar: {
    borderRadius: 78/2,
    width: 78,
    height: 78,
  },
  avatarContainer: {        
    alignItems: 'center',
    
    // paddingTop: 10,
    width: 78,
    height: 78
  },
  text: {
    color: '#474747',
    // color: '#4b4d5c',
    fontFamily: 'ProximaNova-Semibold', //'System',
    fontSize: 21,
    // fontWeight: 'bold',
    marginTop: 25
  },
  textLiked: {
    color: 'white',
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20
  },
  textContainer: {
    width: 120,
    height: 78,
    // marginLeft: 0,
    alignItems: 'center',

  },
  iconic: { 
    marginTop: 15, 
    marginLeft: 30
  }
});

