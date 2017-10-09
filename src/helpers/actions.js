import {  CLEAR_ADMIN_MATCHES, STORE_USER, WEBSOCKET_CREATED_USER,WEBSOCKET_ON_SELECTED, WEBSOCKET_CALCULATE_MANAGER, WEBSOCKET_CALCULATE_CLIENT, WEBSOCKET_NEXT, WEBSOCKET_LAST, WEBSOCKET_LIKES_POST, WEBSOCKET_SELECTED, WEBSOCKET_CLOSED, WEBSOCKET_CONNECTED, WEBSOCKET_RESPONSE_QUEUE, WEBSOCKET_SEND, WEBSOCKET_SENDING, WEBSOCKET_EVENT_DECISION, WEBSOCKET_EVENTS_LIST, WEBSOCKET_CONNECTING, WEBSOCKET_OPENED, WEBSOCKET_DISCONNECTED, WEBSOCKET_MESSAGE } from './constants';


export default actions = {
    connecting: () => ({  
        type: WEBSOCKET_CONNECTING,
        payload: {
          timestamp: new Date(),
        }
    }),
    opened: () => ({  
        type: WEBSOCKET_OPENED,
        payload: {
          timestamp: new Date(),
        }
    }),
    disconnected: () => ({ 
        type: WEBSOCKET_DISCONNECTED,
        payload: {
          timestamp: new Date(),
        }
    }),
    messageReceived: (msg) => ({ 
        type: WEBSOCKET_MESSAGE,
        payload: {
          timestamp: new Date(),
          data: msg,
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
    }),
    responseQueue: (msg) => ({  
        type: WEBSOCKET_RESPONSE_QUEUE,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    connected: (msg) => ({  
        type: WEBSOCKET_CONNECTED,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    closed: (msg) => ({  
        type: WEBSOCKET_CLOSED,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    // selected: (msg) => ({  
    //     type: WEBSOCKET_SELECTED,
    //     payload: {
    //       timestamp: new Date(),
    //       data: msg,
    //     }
    // }),
    likesPost: (msg) => ({  
        type: WEBSOCKET_LIKES_POST,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    next: (msg) => ({  
        type: WEBSOCKET_NEXT,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    last: (msg) => ({  
        type: WEBSOCKET_LAST,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    calculate_client: (msg) => ({  
        type: WEBSOCKET_CALCULATE_CLIENT,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
    // calculate_manager: (msg) => ({  
    //     type: WEBSOCKET_CALCULATE_MANAGER,
    //     payload: {
    //       timestamp: new Date(),
    //       data: msg,
    //     }
    // }),
    createdUser: (msg) => ({  
        type: WEBSOCKET_CREATED_USER,
        payload: {
          timestamp: new Date(),
          data: msg,
        }
    }),
};



export function connect(url) { 
    const action = () => {
        return {
            type: 'WEBSOCKET:CONNECT',
            url: url 
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}


export function fetchEvents() { 
    const action = () => {
        return {
          type: WEBSOCKET_SEND,
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

export function createUser(user) { 
    const action = () => {
        return {
          type: WEBSOCKET_SEND,
          command: 'create_user',
          user: user
        }
    }
    return (dispatch) => { dispatch(action()) }
}

export function clientsQueue() { 
    const action = () => {
        return {
            type: WEBSOCKET_SEND,
            command: 'clients_queue'
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}

export function connected(user) { 
    const action = () => {
        return {
            type: WEBSOCKET_SEND,
            command: 'connected',
            data: user
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}

export function closed() {  // update!!!
    const action = () => {
        return {
            type: WEBSOCKET_SEND,
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
            type: WEBSOCKET_SEND,
            command: 'calculate',
            event_id: event_id
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}

export function startPost(timeout, talk_time, selected, event) {
    const action = () => {
        return {
            type: WEBSOCKET_SEND,
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
}

export function onSelected(participant) {
    const action = () => {
        return {
            type: WEBSOCKET_ON_SELECTED,
            participant: participant
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}


export function storeUser(user) {
    const action = () => {
        return {
            type: STORE_USER,
            user: user
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}

export function clearAdminMatches() {
    const action = () => {
        return {
            type: CLEAR_ADMIN_MATCHES
        }
    }
    return (dispatch) => {
        dispatch(action())
    }
}

 