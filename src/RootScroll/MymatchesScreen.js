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
  Button,
  AsyncStorage,
  TextInput,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';



import { defaultStyles } from '../styles';
import Participant from '../Participant';

import { WS_URL } from "../helpers/constants";


import Communications from 'react-native-communications';

var pech = [];

const { width,height } = Dimensions.get('window')
export default class MymatchesScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      // text: '',
    }; 
  }

  componentDidMount() {
    this.fetchData().done()
  }

  async fetchData() {
    try {
      const myArray = await AsyncStorage.getItem('@MySuperStore:persons');
      if (myArray !== null) {
        
        var persons = JSON.parse(myArray);
        pech = persons;
        
        this.setState({
          persons: persons
        });
      } else {
        console.log('data null')
      }
    } catch (error) {
      alert('error get from asyncstorage: ' + JSON.stringify(error));
    }
  }

  async saveData(myArray) {
    try {
      await AsyncStorage.setItem('@MySuperStore:persons', JSON.stringify(myArray));
    } catch (error) {

    }
  }

  onMessageRecieved = async (e) => { // persons
    console.log(e.data);
    var obj = JSON.parse(e.data); 
    const { person } = this.props 

    if (obj.type == 'CALCULATE_CLIENT') {
      var founded = JSON.parse(obj.data); 
      for (var key in founded ) {
        if (person._id == key) {
          founded[key].shift();  
          founded[key].forEach( (item) => {
            if(!_.some(this.state.persons, item) ) {
              this.state.persons.push(item);
            }
          })
          this.saveData(this.state.persons).done()
          this.setState({
            persons: this.state.persons
          })
        }      
      }
    }
  };
  
  

  phoneCallStart = (participant) => {
    alert(JSON.stringify(participant)) //Communications.phonecall('+79772563015', true)
  }

  ///
  onOpenConnection = () => {
    console.log(' - onopen - ');
  }
  onError = (e) => {
    console.log(e.message);
  };
  onClose = (e) => {
    console.log(e.code, e.reason);
  };
  componentWillMount() {
    this.ws = new WebSocket('ws://localhost:3000'); // localhost
    this.ws.onopen = this.onOpenConnection;
    this.ws.onmessage = this.onMessageRecieved;
    this.ws.onerror = this.onError;
    this.ws.onclose = this.onClose;
  }
  ///


  render() {
    const { person } = this.props  
    const noSimpathy = 'Нет совпадений';
    if (this.state.persons.length + pech.length > 0 ) {  //  && this.state.text.length == 0
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            
            <View style={{
              flexDirection: 'row',
            }}>
              <Text style={styles.verticalText}>Все совпадения</Text>
              <View style={styles.circle}>
                <Text style={styles.digitText}>{this.state.persons.length}</Text>
              </View>
            </View>

            <ScrollView ref={(scrollView) => { this._scrollView = scrollView; }}>
              {this.state.persons.map((participant, index) => {
                 console.log(participant)
                 return <Participant vision={'mymatch_vertical'} participant={participant} key={index} onSelected={this.phoneCallStart}  />
              })}
            </ScrollView>   
  
          </View>
        </View>
      );
     

    } else if( this.state.persons.length + pech.length == 0 ) {
      return (
        <View style={styles.container}>
          <View>
            <Text style={styles.noText}>{noSimpathy}</Text>
          </View>
        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  noText: {
    textAlign: 'center',
    color: '#3f88fb',
    fontWeight: 'bold',
    fontSize: 18
  },
  circle: {
    marginTop: 10,
    marginLeft: 7,
    width: 24,
    height: 24,
    borderRadius: 24/2,
    backgroundColor: '#3f88fb'
  },
  digitText: {
    marginTop: 2.5,
    marginLeft: 7.5,
    color: "white",
    fontSize: 16,
    fontFamily: 'ProximaNova-Semibold',
    backgroundColor: 'transparent'
  },

  
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF'
  },
  navBarButton: {
    color: '#262626',
    textAlign:'center',
    width: 64
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 18
  },
  container: {
    backgroundColor: '#FFF',
  },

  ////
  search: {
    height: 30, 
    borderColor: '#F0F0F0', 
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    fontSize: 15,
    textAlign: 'center'
  },
  searchActive: {
    height: 30, 
    borderColor: '#F0F0F0', 
    borderWidth: 1,
    marginLeft: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    fontSize: 15,
    textAlign: 'center',
  },
  searchIcon: {
    position: 'absolute',
    marginTop: 15,
    marginLeft: 20,
    backgroundColor: '#F0F0F0',
    color: '#888888'
  },
  

  ///
  horizontalText: {
    marginTop: 11.5,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'ProximaNova-Semibold',
    color: '#3f88fb'
  },
  verticalText: {
    marginTop: 11.5,
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'ProximaNova-Semibold',
    color: '#3f88fb'
  },
  horizontal: {
    marginTop: 5,
    marginLeft: 10,
    height: 120
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



 