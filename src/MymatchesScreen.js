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
  Button
} from 'react-native';
import { defaultStyles } from './styles';

import Participant from './Participant';


export default class MymatchesScreen extends Component {
  
  state = {
    persons: []
  }
  
  onOpenConnection = () => {
    console.log(' - onopen - ');
  }
  
  onMessageRecieved = (e) => {
    console.log(e.data);
    var obj = JSON.parse(e.data); 
    const { person } = this.props.navigation.state.params;
    // search for person._id in data 
    // if found setState if not setState = 'no simpatiy'

    // {"person._id1": [""], ...}
    // iterate check if person._id == "person._id1" => display iterate through [""]

    // console.log(obj.data);
    var founded = JSON.parse(obj.data);
    for (var key in founded ) {
      // console.log(person._id, key);
      if (person._id == key) {
        founded[key].forEach( (item) => {
          this.state.persons.push(item);
        })
        this.setState({
          persons: this.state.persons
        })
      }      
    }
    
    
    // re render screen with new results
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

  showMoreInfo = () => {
    console.log('show more info')
  }

  render() {
    const { person } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.navBar}>
          <Text style={styles.navBarButton}
            onPress={() => this.props.navigation.navigate('Events', {
              person: person
            }) }>

            {/* this.props.navigation.goBack() */}
             Events  
          </Text>

          <Text style={styles.navBarHeader}>My matches</Text>
          <Text style={styles.navBarButton}></Text>
        </View>


      
        <Text> Show my matches - User screen </Text>
        {/* <Text> { JSON.stringify(this.state.persons)} </Text> */}


        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView; }}  
        >
          {this.state.persons.map((participant, index) => <Participant participant={participant} key={index} onSelected={this.showMoreInfo}  />)}
        </ScrollView>


        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  // header styles
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF'//'#1EAAF1'
  },
  navBarButton: {
    color: '#1EAAF1',
    textAlign:'center',
    width: 64
  },
  navBarHeader: {
    flex: 1,
    color: '#1EAAF1',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  // container: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    // flex: 1, removed
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



 