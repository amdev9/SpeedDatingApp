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

  Button,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


import { defaultStyles } from '../styles';
import Participant from '../Participant';
import IntervalPopup from './IntervalPopup';

import { WS_URL } from "../helpers/constants";


import { connect } from 'react-redux';
import { startPost, clientsQueue, onSelected } from '../helpers/actions';

@connect(
  state => ({
    participants: state.participants,
    selected: state.selected
  }),
  dispatch => ({
    start_post: (timeout, talk_time, selected, event) => dispatch(startPost(timeout, talk_time, selected, event)),  
    clients_queue: () => dispatch(clientsQueue()),  
    on_selected: (participant) => dispatch(onSelected(participant)),  
  }),
)
export default class ManageScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popupIsOpen: false,
      test: 4 // change to default value
    };
  }  
   
  openInterval = () => {
    this.setState({
      popupIsOpen: true,
    });
  }
  
  closeInterval = () => {
    this.setState({
      popupIsOpen: false,
    });
  }

  closeChoose = (test) => {
    this.closeInterval();
    this.setState({
      test: parseInt(test, 10)  
    }) 
  }
  
  componentWillMount() {
    this.props.clients_queue() // return?
  }

  start = () => {
    const { selected, start_post } = this.props;
    const { event } = this.props.navigation.state.params;
    if (selected.length > 0) {
      console.log(selected)
      start_post(
        2, 
          this.state.test, 
            JSON.stringify(selected), 
              JSON.stringify(event))

      const { navigate } = this.props.navigation;
      navigate('VotingStatus', {
        participants: selected,
        event: event
      });  
    } else {
      alert('Select participants to start')
    }
  }


  render() {
    const { participants, on_selected } = this.props;
    
    const { event } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>

        <View style={styles.navBar}>
        <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
            return this.props.navigation.goBack() // fix
          }
        }>
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
         
        <View style={{
           flexDirection: 'row',
           margin: 20,
           justifyContent: 'center',
        }}>
          <TouchableHighlight 
            underlayColor="#9575CD"
            style={styles.buttonSContainer}
            onPress={this.openInterval}
          >
            <Text style={{ 
              color: "white",
              fontWeight: 'bold', 
              fontSize: 15
              }} >Выбрать промежуток </Text>
              </TouchableHighlight>
          <View style={styles.textContainer}>
            <Text style={{ color: "#3f88fb", fontWeight: 'bold', }}> {this.state.test.toString()} </Text>
          </View>
          
        </View>
        <ScrollView
          ref={(scrollView) => { this._scrollView = scrollView; }}  
        >
          {participants.map((participant, index) => <Participant participant={participant} key={index}  onSelected={on_selected}/>)}
        </ScrollView>


        <TouchableHighlight
            underlayColor="#9575CD"
            style={styles.buttonContainer}
            onPress={this.start}
        >
            <Text style={styles.button}>Начать мероприятие</Text>
        </TouchableHighlight> 

        <IntervalPopup 
          isOpen={this.state.popupIsOpen} 
          onClose={this.closeInterval}
          onChoose={this.closeChoose}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
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
  //////
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
  buttonSContainer: {
    alignItems: 'center',
    backgroundColor: '#3f88fb', //673AB7
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    // margin: 20,
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 10,
    
    // paddingHorizontal: 30,
  },
  buttonContainer: {
    backgroundColor: '#3f88fb',//'#673AB7',
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    margin: 20,
  },
  textContainer: {
    alignItems: 'center',
    // backgroundColor: '#673AB7', //673AB7
    
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#3f88fb',
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    // margin: 20,
    paddingVertical: 10,
    paddingRight: 20,
    paddingLeft: 10,
    // paddingHorizontal: 30,
  },

  button: {
    ...defaultStyles.text,
    color: '#FFFFFF',
    fontSize: 18,
  },
});
