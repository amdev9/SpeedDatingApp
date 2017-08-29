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

import Participant from './Participant';

export default class MatchScreen extends Component {

  render() {
    const { matches } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
         {/*  <Text> { JSON.stringify(matches) }</Text> 
            change to custom matchParticipant
          <ScrollView
            ref={(scrollView) => { this._scrollView = scrollView; }}  
          >
          { matches.map((participant, index) => {
                return  (
                  <Participant participant={participant} key={index} />  
                );
            })
          } 
          </ScrollView>
         */}
         

        { matches.map((object, index) => {
            return object.map((participant, index) => {
              return  (
                <View style={styles.containerPart} >
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
                  </TouchableOpacity>
                </View>
              );
            })

          })
        } 
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
/////
  container: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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



 