import React, { Component } from 'react';
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
import _ from 'lodash';

import { defaultStyles } from '../styles';
import { WS_URL } from "../helpers/constants";

import { connect } from 'react-redux';

import { calculatePost } from '../helpers/actions';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
    admin_matches: state.admin_matches,
    participants: state.participants
  }),
  dispatch => ({
    calculate: (event_id) => dispatch(calculatePost(event_id))
  }),
)
export default class VotingStatusScreen extends Component {
  constructor(props) {
    super(props);
  }
  
  _calculate = async () => {
    const { event } =  this.props.navigation.state.params; 
    this.props.calculate(event._id);
  }

  // shouldComponentUpdate(nextProps, nextState) {
    // return nextProps.admin_matches != this.props.admin_matches;
  // }

  componentWillReceiveProps(nextProps) {
    const { admin_matches } = nextProps;
    console.log(nextProps); 
    if (admin_matches.length > 0) { // fix 
      nextProps.navigation.navigate('Match');  
    } 
  }

  render() {
    const { participants } = this.props;
    return (
      <View style={styles.container}>
  
  {/* 
   change to custom votingParticipant
    */}

    <ScrollView style={{ marginTop: 20 }}
          ref={(scrollView) => { this._scrollView = scrollView; }}  
        >
          {participants.map((participant, index) => {
            return <TouchableOpacity 
              style={styles.containerPart} 
              key={index}
            >
            
              <View style={styles.avatarContainer}>
                {participant.avatar && <Image
                  resizeMode='contain'
                  style={styles.avatar}
                  source={{ uri: participant.avatar }}
                />}
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.text, styles.name]}> {participant.name} </Text>
              </View>
              <View style={styles.avatarListContainer}>
                { typeof participant.likes === 'object' ? participant.likes.person_likes.map( (id, ind)=> {
                    var ob = _.find(participants, function(obj) { return obj._id == id });
                    return <Image
                      resizeMode='contain'
                      style={styles.avatarList}
                      source={{ uri: ob.avatar  }}
                      key={ind}
                    />
                  }) : <View ></View> }
              </View>

            </TouchableOpacity>
          }
          
          )}
          </ScrollView>


        <TouchableHighlight
            underlayColor="#9575CD"
            style={styles.buttonContainer}
            onPress={this._calculate} 
        >
            <Text style={styles.button}>Подсчитать совпадения</Text>
        </TouchableHighlight> 

      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerPart: {
    flex: 1,
    flexDirection: 'row',
    
  },
  avatarContainer: {
    alignItems: 'center',
    marginLeft: 5,
    paddingTop: 10,
    // width: 40,
  },
  textContainer: {
    width: 120,
    height: 60,
    marginLeft: 15,
    
  },
  avatarListContainer: {
    // alignItems: 'center',
    marginLeft: 5,
    paddingTop: 10,
    // width: 40,
  },
  // contentContainer: {
  //   flex: 1,
  //   borderBottomWidth: 1,
  //   borderColor: '#EEE',
  //   padding: 5,
  // },
  avatar: {
    // borderWidth: 1,
    // borderColor: '#EEE',
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  avatarList: {
    // borderWidth: 1,
    // borderColor: '#EEE',
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

  container: {
    flex: 1,
    // marginTop: 20,
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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
    backgroundColor: '#3f88fb',//673AB7
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
