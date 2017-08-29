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

// import ParticipantVote from './ParticipantVote';


export default class VotingStatusScreen extends Component {

  // participants in initial state

  constructor(props) {
    super(props);
    const { person, participants } = this.props.navigation.state.params;
    this.state = {
      participants: participants
    };
  }

  onLiked = (participant) => {
    // if( !this.state.liked.includes(participant._id) ) {
    //   this.state.liked.push(participant._id)
    // } else {
    //   var index = this.state.liked.indexOf(participant._id);
    //   this.state.liked.splice(index, 1);
    // }
  };

  onOpenConnection = () => {
    console.log(' - onopen - ');
  }

  onMessageRecieved = (e) => {
    // when recieved broadcast 'push event' -> rerender VotingStatusScreen
    // console.log(e.data);
    var obj = JSON.parse(e.data); 
    if (obj.type == 'calculate') {
      const { navigate } = this.props.navigation;
      var founded = JSON.parse(obj.data);

      console.log(founded)
      // 59a2c6995a4ffa2284514cff
      // {_id: "59a2c6995a4ffa2284514cff", name: "Александра", avatar: "http://localhost:3000/images/59a2c6b25a4ffa2284514d00"}
      // {_id: "59a498b4be2f9f52448a9432", name: "Alexander", avatar: "https://vk.com/images/camera_50.png"}
      // 59a498b4be2f9f52448a9432
      // {_id: "59a498b4be2f9f52448a9432", name: "Alexander", avatar: "https://vk.com/images/camera_50.png"}
      // {_id: "59a2c6995a4ffa2284514cff", name: "Александра", avatar: "http://localhost:3000/images/59a2c6b25a4ffa2284514d00"}
       
      var passed = [];
      for (var key in founded ) {
        passed.push(founded[key]);
      }    
      navigate('Match', {
        matches: passed
      });  
    } else if ( obj.type == 'likes_post' ) {

      var lik = JSON.parse(obj.data);
      this.state.participants.map( (participant) => {

        if (participant._id == lik.person_id) {
          participant.likes = {
            person_id: lik.person_id,
            person_likes: lik.person_likes
          };
           
          console.log('participant.likes', participant.likes)
        }
        return participant; 
      })
      this.setState({
        participants: this.state.participants
      });

    }
  };

  onError = (e) => {
    console.log(e.message);
  };

  onClose = (e) => {
    console.log(e.code, e.reason);
  };

  componentWillMount() {
    this.ws = new WebSocket('ws://localhost:3000');
    this.ws.onopen = this.onOpenConnection;
    this.ws.onmessage = this.onMessageRecieved;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }

  _calculate = async () => {
    const { event } =  this.props.navigation.state.params;
    let json = JSON.stringify({
      command: "calculate",
      event_id: event._id
    });
    this.ws.send(json);
  }

  render() {
    
    return (
      <View style={styles.container}>
  
          {this.state.participants.map((participant, index) => {
            return <View style={styles.containerPart} >
              <TouchableOpacity>
                <View style={styles.avatarContainer}>
                  {participant.avatar && <Image
                    resizeMode='contain'
                    style={styles.avatar}
                    source={{ uri: participant.avatar }}
                  />}
                </View>
                <View >
                  <Text style={[styles.text, styles.name]}> {participant.name} </Text>
                </View>
                <View >
                  <Text style={[styles.text, styles.name]}> { typeof participant.likes === 'object' ? participant.likes.person_likes.join(',') : '' } </Text>
                  {/* raturn array of avatars */}
                </View>
              </TouchableOpacity>
            </View>
          }
          
          )}
     

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

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#673AB7',
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
