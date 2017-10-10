import React, { Component } from 'react';


import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View, 
  ListView, 
  ScrollView,
  Button,
  Dimensions,
  RefreshControl,
  Image
} from 'react-native';
import { defaultStyles } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';


import Participant from '../Participant';

const { width, height } = Dimensions.get('window');

import { WS_URL } from "../helpers/constants";


import { connected, closed } from '../helpers/actions';
import { connect } from 'react-redux';


@connect(
  state => ({
    current_user: state.current_user, // save matches on server
    vote_participant: state.vote_participant,
    vote_selected: state.vote_selected,
    vote_index: state.vote_index
  }),
  dispatch => ({
    connect: (user) => dispatch(connected(user)), 
    close: (user) => dispatch(closed(user)), 
  }),
)
export default class JoinScreen extends Component { // FIX!

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    
    const { vote_participant, vote_selected, current_user, vote_index } = nextProps; 
    if (vote_participant && vote_selected.length==0) {
      nextProps.navigation.navigate('Voting');  
    } else if (current_user.likes && vote_selected.length > 0 ) {  // fix
      
      nextProps.navigation.navigate('VotePush', {  //
        event: nextProps.navigation.state.params.event
      });  
    }
  }
  
  componentWillMount() {
    const { current_user } = this.props;
    this.props.connect(current_user);
  }

  componentWillUnmount() {
    const { current_user } = this.props;
    this.props.close(current_user);
  }

  render() {
    
    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
              this.props.navigation.goBack() // fix
            } 
          }>
            <Icon style={styles.navBarButtonIcon} name="ios-arrow-back" size={25} color="#900"  />
            <Text style={ [styles.navBarButton,{
              fontWeight: 'bold',
              fontSize: 16,
              marginLeft: 5
            }]}>Назад к мероприятиям</Text>       
          </TouchableOpacity>   
          <Text style={styles.navBarHeader}></Text>
          <Text style={styles.navBarButton}></Text> 
        </View>

        <Text style={styles.title}> title </Text>

 
        <View style={styles.imageContainer}>
          <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Red_Bull_Headquarters_1_%28DFdB%29.JPG/1920px-Red_Bull_Headquarters_1_%28DFdB%29.JPG' }} style={styles.image} />
        </View> 
 
        <Text style={{ 
          marginLeft: 20, 
          marginBottom: 10
        }}> Ожидайте начала .. </Text>
      
          
        <View style={{ 
          alignItems: 'center',
          marginBottom: 10,
          
        }}>
          {/* <Text>Ты можешь встетить их</Text> */}
        </View>
        <View style={{ 
          alignItems: 'center',
          backgroundColor: '#e6e6e6',
        }}>
           
        </View>      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    height: height / 3
  },
  image: {
    ...StyleSheet.absoluteFillObject,   // fill up all space in a container
  },
  avatarOrg: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  avatar: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  avatarContainer: {        
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    margin: 5,
    width: 60,
    height: 60
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    // height: 64,
    backgroundColor: '#FFFFFF' 
  },
  navBarButton: {
    color: '#262626',
    textAlign:'center',
    width: 200,
    color: '#3f88fb'
  },
  navBarButtonIcon: {
    marginTop: -2,
    color: '#262626',
    textAlign:'center',
    marginLeft: 10,
    // width: 200,
    color: '#3f88fb'
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    ...defaultStyles.text,
    marginLeft: 20,
    marginTop: 5
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
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
