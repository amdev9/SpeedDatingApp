import React, { Component } from 'react';
import _ from 'lodash';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  WebView,
  Image
} from 'react-native';
import { defaultStyles } from './styles';
import { put, get } from '../components/api';
import { connect } from 'react-redux';

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
    request: undefined
  };

  _pressFunc = () => {
    console.log('_pressFunc');
    YandexPay.doTestPayment((error, req) => {
      if (error) {
        console.error(error);
      } else {
        this.setState({
          request: req
        });
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
      this.props.navigation.goBack();
       
    }
    catch (error) {
      alert(error);
    }
  };
  
  render() {
    const { event, participant } = this.props.navigation.state.params;
    const { goBack } = this.props.navigation;
    const { request } = this.state;
    return request
      
      ? <WebView
        source={request}
        style={{marginTop: 20}}
      />

      : 

      <View style={styles.container}>
        <Text style={styles.title}> {event.title} </Text>
        <Text> {event.date} </Text>
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.photo }} style={styles.image} />
        </View>
        <Text> { JSON.stringify(event.manage_ids) } </Text>
        <Text> {event.description} </Text>
        <Text> { JSON.stringify(event.participants) } </Text>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() =>  this._finalBookEvent() }//this._pressFunc()} // change to yandex pay func
        >
          <Text style={styles.button}>Final Book Event</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => goBack()}  
            >
          <Text style={styles.button}>Done</Text>
        </TouchableOpacity>
      </View>
    ;
             
    // } else {
    //   return (
    //     <View style={styles.container}>
    //       <Text> Already attended to event </Text>
    //       <TouchableOpacity
    //         style={styles.buttonContainer}
    //         onPress={() => goBack()}  
    //       >
    //         <Text style={styles.button}>Done</Text>
    //       </TouchableOpacity>
    //     </View>
    //   )

    // }
  }

    // else manage event
         
}


const styles = StyleSheet.create({
  title: {
    fontWeight: 'bold',
    marginTop: 20
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