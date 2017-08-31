import React, { Component } from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  WebView,
  Image,
  Dimensions
} from 'react-native';
import { defaultStyles } from './styles';
import { put, get } from '../components/api';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');

const YandexPay = NativeModules.YandexPay;

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
  }),
  dispatch => ({
    refresh: () => dispatch({type: 'GET_EVENT_DATA'}),
  }),
)
export default class Confirmation extends Component {
  state = {
    request: {}
  };

  _pressFunc = () => {
    // console.log('_pressFunc');
    YandexPay.doTestPayment((error, req) => {
      if (error) {
        console.error(error);
      } else {
        console.log('req.status', req.status);
        if (req.status == 'success') {
          this._finalBookEvent();
        }
        this.setState({
          request: req
        });
        // if success callback returned => _finalBookEvent -> view ('Оплата проведена успешно', кнопка 'Вернуться к мероприятиям')
      }
    }); 
  }


  _finalBookEvent = async () => {
    
    // integrate pay screen

    const { events, loading, refresh } = this.props;
    console.log(events, loading, refresh);
    const { event, participant } = this.props.navigation.state.params;
    // this._scrollView.scrollTo({ y: 0 });
    try {
      // Make API call
      const response = await put('events', {
        event_id: event._id,
        participant_id: participant._id,
      }); 

      const json = await response.json();
      console.log(json);

      // events = json; // get events
      // this.props.navigation.goBack();
       
    }
    catch (error) {
      alert(error);
    }
  };
  
  render() {
    const { event, participant } = this.props.navigation.state.params;
    const { goBack } = this.props.navigation;
    const { request } = this.state;
     
    if (request.status == 'process') {
      return <WebView
        source={request}
        style={{
          marginTop: 20,
        }}
      />
    } else if (request.status == 'success') {
      return (
        <View style={styles.container}>
          <Text>Оплата проведена успешно</Text>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => goBack()}  
          >
            <Text style={styles.button}>Вернуться к мероприятиям</Text>
          </TouchableOpacity>
        </View>
      );
    } else {

      return  <View style={styles.container}>
        <View style={styles.navBar}>
          <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => this.props.navigation.goBack() }>
            <Icon style={styles.navBarButtonIcon} name="ios-arrow-back" size={25} color="#900"  />
            <Text style={ [styles.navBarButton,{
              fontWeight: 'bold'
            }]}>Назад к мероприятиям</Text>       
          </TouchableOpacity>   
          <Text style={styles.navBarHeader}></Text>
          <Text style={styles.navBarButton}></Text> 
        </View>


        {/* <Text> { JSON.stringify(event) } </Text>  */}
        {/* add creator info */}

        <Text style={styles.title}> {event.title}</Text>
        <View style={{ 
          flexDirection: 'row', 
          marginLeft: 20, 
          marginTop: 10,
          marginBottom: 10
        }}>
          <Icon name="ios-calendar-outline" size={25} color="#900"  />
          <Text style={{marginLeft: 10}}> {event.date} </Text>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: event.photo }} style={styles.image} />
        </View> 

        <View style={[styles.avatarContainer, {
          marginLeft: 20, 
          marginTop: 15,
          flexDirection: 'row'
        }]}>
          <Image source={{ uri: event.manage_ids[1].avatar }} style={styles.avatarOrg} />
          <Text style={{ 
            width: 120, 
            marginLeft: 10, 
            fontWeight: 'bold', 
            fontSize: 14 
          }}> {event.manage_ids[1].name} </Text>
        </View>
        
        
        <Text style={{ 
          marginLeft: 20, 
          marginBottom: 10
        }}> {event.description} </Text>
      
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>  {
            return  this._pressFunc() //this._finalBookEvent()
          } }//} // change to yandex pay func
        >
          <Text style={styles.button}>Записаться</Text>
        </TouchableOpacity>

        <View style={{ 
          alignItems: 'center',
          marginBottom: 10,
          
        }}>
          <Text>Ты можешь встетить их</Text>
        </View>
        <View style={{ 
          alignItems: 'center',
          backgroundColor: '#e6e6e6',
        }}>
          <View style={{ 
            
            flexDirection: 'row',
          }}> 
            { event.participants.map((participant, index) => {
                return <View style={styles.avatarContainer}>
                  <Image source={{ uri: participant.avatar }} style={styles.avatar} />
                </View>
              }
              
            )}
          </View>   
        </View>    
      </View>
    }

    
  }

    // else manage event
         
}


const styles = StyleSheet.create({

  imageContainer: {
    // flex: 1,
    height: height / 3
    // width: width / 2,         // half of screen widtj
  },
  image: {
    // borderRadius: 10,                   // rounded corners
    ...StyleSheet.absoluteFillObject,   // fill up all space in a container
  },
  avatarOrg: {
    borderRadius: 25,
    width: 50,
    height: 50,
  },
  avatar: {
    borderRadius: 30,
    width: 60,
    height: 60,
    // borderColor: '#FFF',
    // borderWidth: 4
  },
  avatarContainer: {        
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    margin: 5, //?
    // paddingTop: 10,
    width: 60,
    height: 60
  },


  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    // height: 64,
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
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    ...defaultStyles.text,
    marginLeft: 20,
    marginTop: 5
  },
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