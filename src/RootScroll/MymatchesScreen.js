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

  onOpenConnection = () => {
    console.log(' - onopen - ');
  }
  
  onMessageRecieved = async (e) => {
    console.log(e.data);
    var obj = JSON.parse(e.data); 
    const { person } = this.props 

    if (obj.type == 'calculate') {
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

  showMoreInfo = () => {
    console.log('show more info')
  }

  _searchCancel = () => {
    this.setState({
      text: ''
    })
  }

  render() {
    const { person } = this.props  
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

            <ScrollView style={styles.vertical} ref={(scrollView) => { this._scrollView = scrollView; }}>
              {this.state.persons.map((participant, index) => <Participant vision={'mymatch_vertical'} participant={participant} key={index} onSelected={this.showMoreInfo}  />)}
            </ScrollView>   
  
          </View>
        </View>
      );
     

    } else if( this.state.persons.length + pech.length == 0 ) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={{textAlign: 'center'}}>{
              'Начните поиск пар. Когда вы найдете себе несколько пар, они отобразятся здесь и вы сможете отправить им сообщения'
            }</Text>
          </View>
        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create({
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
    //fontWeight: 'bold',
    fontFamily: 'ProximaNova-Semibold',
    backgroundColor: 'transparent'
  },

  
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF'//'#1EAAF1'
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
    // flex: 1, // fixed
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
    // fontColor: '#888888'
  },
  searchActive: {
    height: 30, 
    borderColor: '#F0F0F0', 
    borderWidth: 1,
    marginLeft: 10,
    // marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    fontSize: 15,

    textAlign: 'center',
    
    // fontColor: '#888888'
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
    // fontWeight: 'bold',
    fontFamily: 'ProximaNova-Semibold',
    color: '#3f88fb'
  },
  horizontal: {
    marginTop: 5,
    marginLeft: 10,
    height: 120
  },
  vertical: {
    
    // marginLeft: 10,
    // marginRight: 10,
    // flex: 1
  },
  content: {
    // flex: 1, removed
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



 