import { Platform } from 'react-native';
import { put, get } from '../components/api';

const API = Platform.OS === 'android'
  ? 'http://10.0.3.2:3000/v1' // works for Genymotion
  : 'http://localhost:3000/v1';


export const apiMiddleware = store => next => action => {
  // Pass all actions through by default
  next(action);
  switch (action.type) {
    // In case we receive an action to send an API request
    case 'GET_EVENT_DATA':
      // Dispatch GET_MOVIE_DATA_LOADING to update loading state
      store.dispatch({type: 'GET_EVENT_DATA_LOADING'});
      // Make API call and dispatch appropriate actions when done
      fetch(`${API}/events`)
        .then(response => response.json())
        .then(data => next({
          type: 'GET_EVENT_DATA_RECEIVED',
          data
        }))
        .catch(error => next({
          type: 'GET_EVENT_DATA_ERROR',
          error
        }));
      break;
    // case 'BOOK_EVENT':
    //   store.dispatch({type: 'BOOK_EVENT_LOADING'});
    //   put('events', {
    //     event_id: event._id, // action.props.
    //     participant_id: participant._id, // action.props.
    //   })
    //   .then(response => response.json())
    //   .then(data => next({
    //     type: 'BOOK_EVENT_RECEIVED',
    //     data
    //   }))
    //   .catch(error => next({
    //       type: 'BOOK_EVENT_ERROR',
    //       error
    //     }));
    //   break;
    default:
      break;
  }
};

export const reducer = (state = { events: [], loading: true }, action) => {
  switch (action.type) {
    case 'GET_EVENT_DATA_LOADING':
      return {
        ...state,                   // keep the existing state,
        loading: true,              // but change loading to true
      };
    case 'GET_EVENT_DATA_RECEIVED':
      return {
        loading: false,             // set loading to false
        events: action.data.events, // update movies array with reponse data
      };
    case 'GET_EVENT_DATA_ERROR':
      return state;
    default:
      return state;
    }
};


