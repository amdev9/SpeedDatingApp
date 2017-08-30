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
import Icon from 'react-native-vector-icons/Ionicons';
import Participant from './Participant';

export default class MatchScreen extends Component {

  render() {
    const { matches } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        {/* 
        <View style={styles.navBar}>
          <Icon style={styles.navBarButtonIcon} onPress={() => this.props.navigation.goBack() } name="ios-arrow-back" size={25} color="#900"  />
          <Text style={ [styles.navBarButton,{
            fontWeight: 'bold'
          }]} onPress={() => this.props.navigation.goBack() }>Назад к мероприятиям</Text>
          
          <Text style={styles.navBarHeader}></Text>
          <Text style={styles.navBarButton}>  </Text> 
        </View>
          */}
        

      <ScrollView
          style={{marginTop: 20}} ref={(scrollView) => { this._scrollView = scrollView; }}  
        >

        { matches.map((object, index) => {

            return object.map((participant, index) => {
              return  (
                <TouchableOpacity style={styles.containerPart} >
                  
                    <View style={styles.avatarContainer}>
                      {participant.avatar && <Image
                        resizeMode='contain'
                        style={styles.avatar}
                        source={{ uri: participant.avatar }}
                      />}
                    </View>
                    <View style={ styles.textContainer }>
                      <Text style={[styles.text, styles.name]}> {participant.name} </Text>
                    </View>
                   
                </TouchableOpacity>
              );
            })

          })
        } 
      </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF' // '#1EAAF1'
  },
  navBarButton: {
    color: '#262626',
    textAlign:'center',
    width: 200,
    color: '#3f88fb'
  },
  navBarButtonIcon: {
    marginTop: -4,
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
    // marginTop: 7
  },
  /////////
  containerPart: {
    flexDirection: 'row',
    
  },
  avatarContainer: {
    alignItems: 'center',
    marginLeft: 5,
    paddingTop: 10,
    width: 40,
    
  },

  textContainer: {
    // width: 120,
    // height: 60,
    // marginLeft: 15
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    padding: 5,
    
  },
  avatar: {
    // borderWidth: 1,
    // borderColor: '#EEE',
    borderRadius: 25,
    width: 50,
    height: 50,

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
    flex: 1,
    backgroundColor: '#FFF'
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



 