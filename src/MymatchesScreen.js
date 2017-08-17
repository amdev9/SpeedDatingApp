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

export default class MymatchesScreen extends Component {
  
  state = {
    persons: "persons string"
  }
  
  onOpenConnection = () => {
    console.log(' - onopen - ');
  }
  
  onMessageRecieved = (e) => {
    console.log(e.data);
    var obj = JSON.parse(e.data); 
    this.setState({
      persons: obj.data
    })
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


  render() {
    const { person } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.navBar}>
          <Text style={styles.navBarButton}
            onPress={() => this.props.navigation.goBack()}>

            {/* this.props.navigation.navigate('Events', {
              person: person
            }) */}
             Events  
          </Text>

          <Text style={styles.navBarHeader}>My matches</Text>
          <Text style={styles.navBarButton}></Text>
        </View>


      
        <Text> Show my matches - User screen </Text>
        <Text> {this.state.persons} </Text>
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



 