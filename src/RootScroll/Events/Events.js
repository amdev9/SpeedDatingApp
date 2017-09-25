import React, { Component } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  SegmentedControlIOS,
  Button,
  Text
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab'
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import _ from 'lodash';


import EventPoster from './EventPoster';
import EventPopup from './EventPopup';
import { defaultStyles } from '../../styles';


import { fetchEvents } from '../../helpers/actions';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
  }),
  dispatch => ({
    refresh: () => dispatch(fetchEvents()),  // {type: 'GET_EVENT_DATA'}
  }),
)
export default class Events extends Component {
  
  
  constructor(props) {
    super(props);
    this.state = {
      popupIsOpen: false,
      selectedIndex: 1,
      chosenTable: null,     
      // events: props.events // added
    };
  }

  
  openEvent = (event) => {
    this.setState({
      popupIsOpen: true,
      event,	
    });
  }
  
  closeEvent = () => {
    this.setState({
      popupIsOpen: false,
      // Reset values to default ones
      chosenDay: 0,
      chosenTime: null,
    });
  }

  bookEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Confirmation', {
      event: this.state.event,
      participant: this.props.user 
    }); 
  }

  joinEvent = () => {
    if ( this.state.chosenTable == null) {
      alert('Please select table');
    } else {
      // alert('U Selecte table ' + this.state.chosenTable);
      this.closeEvent();
      const { navigate } = this.props.navigation;
      this.props.user.table = this.state.chosenTable + 1; // navigation.state.params.person
      navigate('Join', {
        // table: this.state.chosenTable,
        event: this.state.event,
        person: this.props.user 
      }); 
    }
  }

  manageEvent = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('Manage', {
      event: this.state.event,
      person: this.props.user 
    }); 
  }

  manageEventRequest = () => {
    this.closeEvent();
    const { navigate } = this.props.navigation;
    navigate('ManagePermission', {
      event: this.state.event,
      person: this.props.user,
    }); 
  }

  chooseTable = (table) => {
    this.setState({
      chosenTable: table,
    });
  }

  //////////////////// move to scrolltab , then redux
  
  // onOpenConnection = () => {
  //   console.log(' - onopen - ');
  // }

  // onMessageRecieved = async (e) => {
  //   console.log(e.data);
    // var obj = JSON.parse(e.data); 
    
    // if (obj.type == "event_decision") {
    //   let updatedEvent = JSON.parse(obj.data)
    //   let eventsFromState = this.state.events;
    //   _.remove(eventsFromState, { '_id': updatedEvent._id }); 
    //   eventsFromState.push(updatedEvent); // add order

    //   console.log('1) eventsFromState: ', eventsFromState) 

    //   this.setState({
    //     events: eventsFromState
    //   });
    // }

  // };
  
  // onError = (e) => {
  //   console.log(e.message);
  // };
  
  // onClose = (e) => {
  //   console.log(e.code, e.reason);
  // };

  componentWillMount() { 
    console.log('>>>>>>>>>>>>>>>> componentWillMount >>>>>>>>>>>>>>>>>>>')
    this.props.refresh();
   

  //   this.ws = new WebSocket('ws://192.168.1.33:3000'); 
  //   this.ws.onopen = this.onOpenConnection;
  //   this.ws.onmessage = this.onMessageRecieved;
  //   this.ws.onerror = this.onError;
  //   this.ws.onclose = this.onClose;
  }


  render() {

    // console.log(this.props)
    // console.log(this.state)

    const { events, loading, refresh } = this.props;  

    
    // this.state.
    
    const { user } =  this.props;
    return (
      <View style={styles.container}>
      
        <View style={styles.bottomContent}>
          <SegmentedControlTab 
            tabStyle={styles.tabStyle}
            tabTextStyle={styles.tabTextStyle}
            activeTabStyle={styles.activeTabStyle}
            
            values={['Мои', 'Найти']}
            selectedIndex={this.state.selectedIndex}
            onTabPress={(index) => {
              this.setState({selectedIndex: index});
            }}
          />
        </View>

        {events 
          ? <ScrollView
              contentContainerStyle={styles.scrollContent}
              // Hide all scroll indicators
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={refresh}
                />
              }
            >
              {events.map((event, index) => {
                console.log(index)
                if (this.state.selectedIndex == 0) {
                  if (event.participant_ids.includes(user._id)  ) { //(  typeof event.participants !== 'undefined' && event.participants.length > 0 &&  _.map(event.participants, '_id').indexOf(person._id) > -1 ) { 
                    return <EventPoster
                      event={event} // comment it & pass events - connect
                      person={user}
                      onOpen={this.openEvent}
                      //index={index}
                      key={index}
                    /> 
                  }  
                } else {
                  return <EventPoster
                    event={event} // comment it & pass events - connect
                    person={user}
                    onOpen={this.openEvent}
                   // index={index}
                    key={index}
                  /> 
                }
              }

              )}
            </ScrollView>
          : <ActivityIndicator
              animating={loading}
              style={styles.loader}
              size="large"
            />
        }

        <EventPopup
          event={this.state.event}
          person={user}
          isOpen={this.state.popupIsOpen}
          onClose={this.closeEvent}
          onBook={this.bookEvent}
          onJoin={this.joinEvent}
          onManage={this.manageEvent}
          onManageRequest={this.manageEventRequest}
          chosenTable={this.state.chosenTable}
          onChooseTable={this.chooseTable}
        />
      </View>
      
    );
  }

}

const styles = StyleSheet.create({

  tabStyle: {
    // paddingVertical: 5,
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderColor: '#3f88fb',
    // borderWidth: 1,
    // backgroundColor: 'white',
  },
  activeTabStyle: {
      backgroundColor: '#3f88fb'
  },
  tabTextStyle: {
      color: '#3f88fb'
  },

  // header styles
  gradient: {
    width: 400,
    height: 200,
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    // height: 64
    // backgroundColor: '#FFFFFF' //'#1EAAF1'
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
    height: 500, // change ti flex????
    // flex: 1,               // fixed
    //paddingTop: 20,         // start below status bar
    backgroundColor: '#FFFFFF'
  },
  loader: {
    flex: 1,
    alignItems: 'center',     // center horizontally
    justifyContent: 'center', // center vertically
  },
  scrollContent: {
    paddingTop: 20, 
    flexDirection: 'row',   // arrange posters in rows
    flexWrap: 'wrap',       // allow multiple rows
  },

  bottomContent: {
    // margin: 30,
    // borderTopColor: '#262626',
    // borderRadius: 1,
    marginTop: 5, 
    marginRight: 10,
    marginLeft: 10
  }
});