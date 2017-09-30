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

export function fetchEvents() { 
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

export function clientsQueue() { 
    const action = () => {
        return {
            type: 'WEBSOCKET:SEND',
            command: 'clients_queue'
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}

export function connected() { 
    const action = () => {
        return {
            type: 'WEBSOCKET:SEND',
            command: 'connected'
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}

export function closed() { 
    const action = () => {
        return {
            type: 'WEBSOCKET:SEND',
            command: 'closed'
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}

export function calculatePost(event_id) {
    const action = () => {
        return {
            type: 'WEBSOCKET:SEND',
            command: 'calculate',
            event_id: event_id
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
    // const { event } =  this.props.navigation.state.params;
    // let json = JSON.stringify({
    //   command: "calculate",
    //   event_id: event._id
    // });
    // this.ws.send(json);
}

export function startPost(timeout, talk_time, selected, event) {
    const action = () => {
        return {
            type: 'WEBSOCKET:SEND',
            command: 'start',
            timeout: timeout,
            talk_time: talk_time,
            selected: selected,
            event: event
        }
    }
    return (dispatch) => {
        dispatch(action())
    }

// let json = JSON.stringify({
//     command: "start",
//     timeout: 2,
//     talk_time: this.state.test,
//     selected: JSON.stringify(this.state.selected),
//     event: JSON.stringify(event)
//   });
//   this.ws.send(json);
}