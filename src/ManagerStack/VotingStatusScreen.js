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

export default class VotingStatusScreen extends Component {


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
            

      Array.prototype.indexOfForArrays = function(search)
      {
        var searchJson = JSON.stringify(search); // "[3,566,23,79]"
        var arrJson = this.map(JSON.stringify); // ["[2,6,89,45]", "[3,566,23,79]", "[434,677,9,23]"]
        return arrJson.indexOf(searchJson);
      };


      for (var key in founded ) { 
          founded[key].shift();  
      }

      var passed = [];
      var final = [];
      
      for (var key in founded ) {
          founded[key].forEach( (item) => {  // null
              founded[item._id].forEach( (found) => {
                  if (found._id == key) {
                      var s = [key, item._id].sort();
                      if ( passed.indexOfForArrays(s) < 0 ) { 
                          passed.push(s);
                      } else {
                          final.push(s); // [ s, .. ]
                      }
                  }
              })
          })
      }

      var final_ob_done = []; // array of pairs = 2 item arrays
      final.forEach( (fin) => {
        var final_ob = [];
        for (var key in founded ) { 
            founded[key].forEach ( (it) => {

                if ( fin.indexOf(it._id) > -1 ) {
                  var ind = fin.indexOf(it._id);
                  fin.slice(ind , 1);
                  final_ob.push(it);
                }

            })
        }
        final_ob_done.push(final_ob);
      })

      console.log(final_ob_done);

      navigate('Match', {
        matches: final_ob_done
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
    this.ws = new WebSocket(WS_URL);
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
  
  {/* 
   change to custom votingParticipant
    */}

    <ScrollView style={{ marginTop: 20 }}
          ref={(scrollView) => { this._scrollView = scrollView; }}  
        >
          {this.state.participants.map((participant, index) => {
            return <TouchableOpacity style={styles.containerPart} >
              
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
                   {/* <Text style={[styles.text, styles.name]}>  </Text>
                  render avatars */}
                  { typeof participant.likes === 'object' ? participant.likes.person_likes.map( (id)=> {
                    var ob = _.find(this.state.participants, function(obj) { return obj._id == id });
                    return <Image
                      resizeMode='contain'
                      style={styles.avatarList}
                      source={{ uri: ob.avatar  }}
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
