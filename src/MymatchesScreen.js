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
import { defaultStyles } from './styles';


import Participant from './Participant';
import Icon from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';

// AsyncStorage.clear();
var pech = [];
 

const { width,height } = Dimensions.get('window')


export default class MymatchesScreen extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      persons: [],
      text: '',
      // searchFlag: false,
    }; 
  }

  setSearchText(text) {
    this.setState({text})
     // pech
    let filteredData = this.filterNotes(text, pech);
    this.setState({
      // searchFlag: true,
      persons: filteredData
    })
    // hide 
  }

  filterNotes(searchText, notes) {
    console.log(notes);
    let text = searchText.toLowerCase();
    console.log(text);
    return _.filter(notes, (n) => {
      let note = n.name.toLowerCase();
      console.log(note);
      return note.search(text) !== -1;
    });
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
        pech = persons;
        
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
    const { person } = this.props //.navigation.state.params;
    
    if (obj.type == 'calculate') {
      // if(obj && typeof(obj.data) !== 'undefined') {
        var founded = JSON.parse(obj.data); // unexpected eof
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
      // }
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
    this.ws = new WebSocket('ws://192.168.1.33:3000'); // localhost
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
    console.log(this.state);
    const { person } = this.props //.navigation.state.params;
    if (this.state.persons.length + pech.length > 0 && this.state.text.length == 0 ) { // && this.state.searchFlag == false 
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
            
            <View>
              <TextInput
                style={styles.search} 
                placeholder="Поиск"
                placeholderTextColor="#888888"
                selectionColor="#3f88fb"
                onChangeText={
                  this.setSearchText.bind(this)
                }
                value={this.state.text}
              />
              <Icon style={styles.searchIcon}  name="ios-search" size={20} color="#000"/>
            </View>
   
            <View style={{
              flexDirection: 'row',
            }}>
              <Text style={styles.horizontalText}>Новые совпадения</Text>
              <View style={styles.circle}>
                <Text style={styles.digitText}>3</Text>
              </View>
            </View>
            <ScrollView style={styles.horizontal} ref={(scrollView) => { this._scrollView = scrollView; }} horizontal={true}>
              {/* this.state.persons */}
              {this.state.persons.map((participant, index) => <Participant vision={'mymatch_horizontal'} participant={participant} key={index} onSelected={this.showMoreInfo}  />)}
            </ScrollView> 
            
            <View style={{
              flexDirection: 'row',
            }}>
              <Text style={styles.verticalText}>Все совпадения</Text>
              <View style={styles.circle}>
                <Text style={styles.digitText}>5</Text>
              </View>
            </View>

            <ScrollView style={styles.vertical} ref={(scrollView) => { this._scrollView = scrollView; }}>
              {/* this.state.persons + async storage */}
              {this.state.persons.map((participant, index) => <Participant vision={'mymatch_vertical'} participant={participant} key={index} onSelected={this.showMoreInfo}  />)}
            </ScrollView>   
  
          </View>
        </View>
      );
    } else if(this.state.persons.length + pech.length > 0  && this.state.text.length > 0) { // && this.state.searchFlag == true
      return (
        <View style={styles.container}>
          <View style={styles.content}>

 
            
            <View style={{ 
              marginTop: 20, 
              flexDirection: 'row',
            }}>
              <View style={{ width: width - 110}}>
                <TextInput
                  style={styles.searchActive} 
                  placeholder="Поиск"
                  placeholderTextColor="#888888"
                  selectionColor="#3f88fb"
                  onChangeText={this.setSearchText.bind(this)}
                  value={this.state.text}
                />
                <Icon style={styles.searchIcon}  name="ios-search" size={20} color="#000"/>
              </View>
              <TouchableOpacity 
                onPress={this._searchCancel}
                style={
                {
                  width: 110,
                  marginTop: 14
                }
              }>
                <Text style={{
                  color: '#3f88fb',
                  textAlign:'center',
                  fontSize: 17,
                  //fontWeight: 'bold'
                }}>Отменить</Text>
              </TouchableOpacity>
            </View>
            
  
            <View style={{
              flexDirection: 'row'
            }}>
              <Text style={styles.verticalText}>Найдено</Text>
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
            <View style={styles.navBar}>
              <Icon style={styles.navBarButton}
                onPress={() => this.props.navigation.navigate('Events', {
                  person: person
                }) } name="ios-calendar-outline" size={30} color="#900" /> 
                <Text style={styles.navBarHeader}>Мои совпадения</Text>
              <Text style={styles.navBarButton}></Text>
            </View>
            <Text style={{textAlign: 'center'}}>Начните поиск пар. Когда вы найдете себе несколько пар, они отобразятся здесь и вы сможете отправить им сообщения</Text>
            {/* No matches yet */}
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
    fontSize: 18,
    // marginTop: 5
  },
  container: {
    flex: 1,
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



 