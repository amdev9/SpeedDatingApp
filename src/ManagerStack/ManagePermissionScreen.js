import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View, 
  ListView, 
  ScrollView,
  RefreshControl
} from 'react-native';

import { defaultStyles } from '../styles';


import { connect } from 'react-redux';
import { manageEvent } from '../helpers/actions';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
    current_user: state.current_user
  }),
  dispatch => ({
    update_user: (person_id, event_id) => dispatch(manageEvent(person_id, event_id)), 
  }),
)
export default class ManagePermissionScreen extends Component {
    
  onAttend = async () => {
    const { current_user } = this.props;
    const { event } = this.props.navigation.state.params;
    try {
      this.props.update_user(current_user._id, event._id)   
      this.props.navigation.goBack(); 
    }
    catch (error) {
      alert(error);
    }
  };

  render() {
    
    return (
      <View style={styles.container}>
        
        <View style={styles.navBar}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.goBack() }>
            <Icon style={styles.navBarButtonIcon} name="ios-arrow-back" size={25} color="#900"  />
            <Text style={ [styles.navBarButton,{
              fontWeight: 'bold',
              fontSize: 16,
              marginLeft: 5
            }]}>Назад к мероприятиям</Text>       
          </TouchableOpacity>   
          <Text style={styles.navBarHeader}></Text>
          <Text style={styles.navBarButton}></Text> 
        </View>

        <View style={styles.containerPart} >
          <Text style={{ textAlign: 'center'}}>Информация для потенциальных организаторов мероприятия</Text>
        </View>
        <TouchableHighlight
            underlayColor="#9575CD"
            style={styles.buttonContainer}
            onPress={this.onAttend}
            >
            <Text style={styles.button}>Подать заявку</Text>
        </TouchableHighlight> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  containerPart: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    // height: 64,
    backgroundColor: '#FFFFFF' 
  },
  navBarButton: {
    color: '#262626',
    textAlign:'center',
    width: 200,
    color: '#3f88fb'
  },
  navBarButtonIcon: {
    marginTop: -2,
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
    backgroundColor: '#3f88fb',
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
