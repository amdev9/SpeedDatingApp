
import actions from './actions'
import { WEBSOCKET_CONNECT, WEBSOCKET_DISCONNECT, WEBSOCKET_SEND } from './constants';

const socketMiddleware = (function(){ 
  var socket = null;

  const onOpen = (ws,store) => evt => { // ,token
    console.log('========== onOpen =========')
    //Send a handshake, or authenticate with remote end

    //Tell the store we're connected
    store.dispatch(actions.connected());
  }

  const onClose = (ws,store) => evt => {
    //Tell the store we've disconnected
    store.dispatch(actions.disconnected());
  }

  const onMessage = (ws,store) => evt => {
    //Parse the JSON message received on the websocket
    var msg = JSON.parse(evt.data);
    switch(msg.type) {
      case "EVENTS_LIST": 
        //Dispatch an action that adds the received message to our state
        store.dispatch(actions.eventsList(msg));
        break;
      case "EVENT_DECISION": 
        store.dispatch(actions.eventDecision(msg));
        break;
      case "RESPONSE_QUEUE": 
        store.dispatch(actions.responseQueue(msg));
        break;
      case "CONNECTED":
        store.dispatch(actions.connected(msg));
        break;
      case "CLOSED":
        store.dispatch(actions.closed(msg));
        break;
      case "SELECTED":
        store.dispatch(actions.selected(msg))
        break;
      case "calculate": // votingStatusScreen // myMatchScreen // 
        break;
      case "LIKES_POST":
        store.dispatch(actions.likesPost(msg))
        break;
      case "NEXT":
        store.dispatch(actions.next(msg))
        break;
      case "LAST":
        store.dispatch(actions.last(msg))
        break;

      default:
        console.log("Received unknown message type: '" + msg.type + "'");
        break;
    }
  }

  const onError = () => evt => {
    console.log(evt)
    // store.dispatch(actions.errorReceived(evt));
  }

  return store => next => action => {
    switch(action.type) {

      //The user wants us to connect
      case WEBSOCKET_CONNECT: //'CONNECT':
        console.log('WEBSOCKET_CONNECT: ', action.url)
        //Start a new connection to the server
        if(socket != null) {
          socket.close();
        }
        //Send an action that shows a "connecting..." status for now
        store.dispatch(actions.connecting());

        //Attempt to connect (we could send a 'failed' action on error)
        socket = new WebSocket(action.url);
        socket.onmessage = onMessage(socket,store);
        socket.onclose = onClose(socket,store);
        socket.onopen = onOpen(socket,store); // ,action.token
        socket.onerror = onError();

        break;

      //The user wants us to disconnect
      case WEBSOCKET_DISCONNECT: //'DISCONNECT':
        if(socket != null) {
          socket.close();
        }
        socket = null;

        //Set our state to disconnected
        store.dispatch(actions.disconnected());
        break;

      //Send the 'SEND_MESSAGE' action down the websocket to the server
      case WEBSOCKET_SEND: //'SEND_CHAT_MESSAGE':
        store.dispatch(actions.sending());
        socket.send(JSON.stringify(action));
        break;

      //This action is irrelevant to us, pass it on to the next middleware
      default:
        return next(action);
    }
  }

})();

export default socketMiddleware