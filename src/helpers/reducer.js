import _ from 'lodash';


export default  reducer = (state = { events: [], loading: true }, action) => {
    switch (action.type) {
      case 'WEBSOCKET:MESSAGE':
        // Assuming that your data is a DOMString in JSON format
        const data_message = (action.payload.data); // JSON.parse
        console.log('WEBSOCKET:MESSAGE: ', data_message);
        return { ...state, ...data_message}

      case 'WEBSOCKET:EVENT_DECISION':
        const updatedEvent = JSON.parse(action.payload.data.event); 
        let eventsFromState = state.events;
        _.remove(eventsFromState, { '_id': updatedEvent._id }); 
        eventsFromState.push(updatedEvent); // add order
        console.log('-- reducer WEBSOCKET:EVENT_DECISION')
        return { 
          loading: false, 
          events: eventsFromState  // update this.state
        }

      case 'WEBSOCKET:EVENTS_LIST':
        const data_events = JSON.parse(action.payload.data.events); 
        return { 
          loading: false, 
          events: data_events
        }

      case 'WEBSOCKET:SENDING': 
        console.log('WEBSOCKET:SENDING');
        return { 
          ...state, 
          loading: true
        }

      default:
        return state
    }
}