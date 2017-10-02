export const WEBSOCKET_CONNECT = 'WEBSOCKET:CONNECT';
export const WEBSOCKET_DISCONNECT = 'WEBSOCKET:DISCONNECT';
export const WEBSOCKET_SEND = 'WEBSOCKET:SEND';

// Action types dispatched by the WebSocket implementation
export const WEBSOCKET_CONNECTING = 'WEBSOCKET:CONNECTING';
export const WEBSOCKET_OPENED = 'WEBSOCKET:OPENED';
export const WEBSOCKET_DISCONNECTED = 'WEBSOCKET:DISCONNECTED';
export const WEBSOCKET_MESSAGE = 'WEBSOCKET:MESSAGE';

export const WEBSOCKET_EVENTS_LIST =  'WEBSOCKET:EVENTS_LIST';
export const WEBSOCKET_SENDING = 'WEBSOCKET:SENDING';
export const WEBSOCKET_EVENT_DECISION = 'WEBSOCKET:EVENT_DECISION';

export const WEBSOCKET_RESPONSE_QUEUE = 'WEBSOCKET:RESPONSE_QUEUE';
export const WEBSOCKET_CLOSED = 'WEBSOCKET:CLOSED';
export const WEBSOCKET_CONNECTED = 'WEBSOCKET:CONNECTED';
export const WEBSOCKET_SELECTED = 'WEBSOCKET:SELECTED';
export const WEBSOCKET_LIKES_POST = 'WEBSOCKET:LIKES_POST';
export const WEBSOCKET_NEXT = 'WEBSOCKET:NEXT';
export const WEBSOCKET_LAST = 'WEBSOCKET:LAST';

export const WEBSOCKET_CALCULATE_CLIENT = 'WEBSOCKET:CALCULATE_CLIENT';
export const WEBSOCKET_CALCULATE_MANAGER = 'WEBSOCKET:CALCULATE_MANAGER';
export const WEBSOCKET_ON_SELECTED = 'WEBSOCKET:CALCULATE_ON_SELECTED';

const IP_ADDRESS = 'localhost'; //'51.15.66.253';
const PORT = '3000';
export const URL = `http://${IP_ADDRESS}:${PORT}`; 
export const WS_URL = `ws://${IP_ADDRESS}:${PORT}`;
