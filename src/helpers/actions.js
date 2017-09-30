import { WEBSOCKET_SEND, WEBSOCKET_SENDING, WEBSOCKET_EVENT_DECISION, WEBSOCKET_EVENTS_LIST, WEBSOCKET_CONNECTING, WEBSOCKET_OPEN, WEBSOCKET_CLOSED, WEBSOCKET_MESSAGE } from './constants';


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
}

export function updateEvent(event_id, participant_id) { 
    const action = () => {
        return {
          type: WEBSOCKET_SEND,
          command: 'update_event',
          event_id: event_id,
          participant_id: participant_id
        }
    }

    return (dispatch) => {
        dispatch(action())
    }
}

export function manageEvent(person_id, event_id) { 
    const action = () => {
        return {
          type: WEBSOCKET_SEND,
          command: 'manage_event',
          person_id: person_id,
          event_id: event_id
        }
    }
    return (dispatch) => { dispatch(action()) }
}

export function likesFunc(person_id, event_id, likes) { 
    const action = () => {
        return {
          type: WEBSOCKET_SEND,
          command: 'likes',
          person_id: person_id,
          event_id: event_id,
          likes: likes
        }
    }
    return (dispatch) => { dispatch(action()) }
}

export function updateUser(user) { 
    const action = () => {
        return {
          type: WEBSOCKET_SEND,
          command: 'update_user',
          user: user
        }
    }
    return (dispatch) => { dispatch(action()) }
}

 
