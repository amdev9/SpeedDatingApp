import { WEBSOCKET_SENDING, WEBSOCKET_EVENT_DECISION, WEBSOCKET_EVENTS_LIST, WEBSOCKET_CONNECTING, WEBSOCKET_OPEN, WEBSOCKET_CLOSED, WEBSOCKET_MESSAGE } from './constants';


export default actions = {
    connecting: () => ({  // event, websocket
        type: WEBSOCKET_CONNECTING,
        payload: {
          timestamp: new Date(),
          // event,
          // websocket
        }
    }),
    connected: () => ({  // event
        type: WEBSOCKET_OPEN,
        payload: {
          timestamp: new Date(),
          // event
        }
    }),
    disconnected: () => ({  // event
        type: WEBSOCKET_CLOSED,
        payload: {
          timestamp: new Date(),
          // event
        }
    }),
    messageReceived: (msg) => ({  // event
        type: WEBSOCKET_MESSAGE,
        payload: {
          timestamp: new Date(),
          data: msg,
          // event
        }
    }),
    eventsList: (msg) => ({  
        type: WEBSOCKET_EVENTS_LIST,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    eventDecision: (msg) => ({  
        type: WEBSOCKET_EVENT_DECISION,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    sending: () => ({  
        type: WEBSOCKET_SENDING,
        payload: {
          timestamp: new Date(),
        }
    })
    
};




// data_loading - before send ws message
// data_received - onmessage received message with data
// data_error - onerror 

export function fetchEvents() { // fetchEvents
    const action = () => {
        return {
          type: 'WEBSOCKET:SEND',
          command: 'events_list'
        }
    }

    return (dispatch) => {
        dispatch(action())
    }

    // return (dispatch) => {
    //   dispatch(getData())
    //   getPeople()
    //     .then((data) => {
    //       dispatch(getDataSuccess(data))
    //     })
    //     .catch((err) => console.log('err:', err))
    // }
}

export function updateEvent(event_id, participant_id) { 
    const action = () => {
        return {
          type: 'WEBSOCKET:SEND',
          command: 'update_event',
          event_id: event_id,
          participant_id: participant_id
        }
    }

    return (dispatch) => {
        dispatch(action())
    }
}



// add function for userSave , postLike, ..