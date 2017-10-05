import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableHighlight
} from 'react-native';


import { onSignIn } from "../helpers/auth";
import { ResetToSignedIn } from "../helpers/router";
import Icon from 'react-native-vector-icons/Entypo';
import { defaultStyles } from '../styles';



const { width,height } = Dimensions.get('window')

import { connect } from 'react-redux';
import { createUser } from '../helpers/actions';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
  }),
  dispatch => ({
    create_user: (user) => dispatch(createUser(user)), 
  }),
)
export default class Fullfill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }
    
  _continue = () => {
    const { user } = this.props.navigation.state.params;
    user.name = this.state.name;
    this.props.create_user(user);
    onSignIn(user).then(() => this.props.navigation.dispatch(ResetToSignedIn)) 
  }

  
  render() {
    const { goBack } = this.props.navigation; // go to login
    let continueText = 'ПРОДОЛЖИТЬ';
    return (
   
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.goBack() }>
            <Icon style={styles.headerIcon} name="chevron-left" size={45} color="#c8c8c8"  />    
            {/* <Icon style={styles.headerIcon} name="chevron-left" size={45} color="#c8c8c8"  />     */}
          </TouchableOpacity>   
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Меня зовут</Text>
          <TextInput
            autoFocus = {true}
            style={styles.item}
            placeholder='Имя'
            onChangeText={(text) => this.setState({name: text})}
            value={this.state.name}
            
          />
        
        {this.state.name.length > 0 
          ? 
            <TouchableOpacity style={styles.buttonContainer} onPress={this._continue}>
              <Text style={styles.button}>{continueText}</Text>
            </TouchableOpacity>
          :
            <TouchableOpacity style={styles.buttonContainerInactive}>
              <Text style={styles.buttonInactive}>{continueText}</Text>
            </TouchableOpacity>
        }
        </View>
      </View>
    );
  }
}
    
const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    marginBottom: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  content: {
    marginLeft: 20,
    marginRight: 20
  },
  headerIcon: {
    marginTop: 15,
    marginLeft: 20
  },
  item: {
    marginLeft: 30,
    marginTop: 15,
    fontSize: 22,
    height: 44,
    fontFamily: 'System',
    textAlign: 'left',
  },
  title: {
    marginLeft: 30,
    fontWeight: 'bold',
    fontSize: 40,
    color: 'black',
  },
  
  
  buttonContainerInactive: {
    alignItems: 'center',
    backgroundColor: '#fafbfd',
    borderRadius: 100,
    margin: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonInactive: {
    fontSize: 25,
    color: '#c8c8c8',
    fontWeight: 'bold'
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#3f88fb',
    borderRadius: 100,
    margin: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  button: {
    fontSize: 25,
    color: 'white',
    fontWeight: 'bold'
  },

  back: {
    marginTop: 30,
    backgroundColor: '#FFFFFF'
  },
  transparent: {
    color: 'transparent'
  },
  colorfull: {
    color: '#3f88fb'
  },
  navBarTest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 20
  },
   
  sectionHeader: {
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  
});