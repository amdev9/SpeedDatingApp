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
  Button,
  AsyncStorage,
  TextInput
} from 'react-native';
import { defaultStyles } from './styles';

import Participant from './Participant';
import Icon from 'react-native-vector-icons/Ionicons';


// AsyncStorage.clear();

export default class MymatchesScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      text: 'Useless Multiline Placeholder',
    }; 
  }

   

  componentDidMount() {
    this.fetchData().done()
  }

  async fetchData() {
     // on init get from async storage
    try {
      const myArray = await AsyncStorage.getItem('@MySuperStore:persons');
      if (myArray !== null) {
        console.log('data recieved and not null')
        var persons = JSON.parse(myArray);
        this.setState({
          persons: persons
        });
      } else {
        console.log('data null')
        
      }
    } catch (error) {
      alert('error get from asyncstorage');
    }
  }

  async saveData(myArray) {
    try {
      await AsyncStorage.setItem('@MySuperStore:persons', JSON.stringify(myArray));
    } catch (error) {
      // Error saving data
    }
  }


  onOpenConnection = () => {
    console.log(' - onopen - ');
  }
  
  onMessageRecieved = (e) => {
    console.log(e.data);
    var obj = JSON.parse(e.data); 
    const { person } = this.props.navigation.state.params;
    
    var founded = JSON.parse(obj.data);
    for (var key in founded ) {
      if (person._id == key) {
        founded[key].shift();  
        founded[key].forEach( (item) => {
          // push if not duplication
          console.log(this.state.persons)
          if(!_.some(this.state.persons, item) ) {
            console.log('not include')
            this.state.persons.push(item);
          }
        })

        this.saveData(this.state.persons).done()

        // set new and merge old (overwrite) with current results 
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
            <Icon style={styles.navBarButton}
              onPress={() => this.props.navigation.navigate('Events', {
                person: person
              }) } name="ios-calendar-outline" size={30} color="#900" /> 
              <Text style={styles.navBarHeader}>Мои совпадения</Text>
            <Text style={styles.navBarButton}></Text>
          </View>
          {/* search by name of matchers */}
          <TextInput
            style={styles.search}
            onChangeText={(text) => this.setState({text})}
            value={this.state.text}
          />
          
          <Text style={styles.horizontalText}>Last event matches</Text>
          <ScrollView style={styles.horizontal} ref={(scrollView) => { this._scrollView = scrollView; }} horizontal={true}>
            {this.state.persons.map((participant, index) => <Participant participant={participant} key={index} onSelected={this.showMoreInfo}  />)}
          </ScrollView> 
          <Text style={styles.verticalText}>All matches</Text>
          <ScrollView style={styles.vertical} ref={(scrollView) => { this._scrollView = scrollView; }}>
            {this.state.persons.map((participant, index) => <Participant participant={participant} key={index} onSelected={this.showMoreInfo}  />)}
          </ScrollView> 

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    fontSize: 15,
    // marginTop: 5
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  search: {
    height: 30, 
    borderColor: 'lightgray', 
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
    fontSize: 15,
    
  },
  horizontalText: {
    marginTop: 10,
    marginLeft: 10,
    fontWeight: 'bold'
  },
  verticalText: {
    marginLeft: 10,
    fontWeight: 'bold'
  },
  horizontal: {
    marginLeft: 10,
    height: 80
  },
  vertical: {
    marginLeft: 10,
    marginRight: 10,
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



 