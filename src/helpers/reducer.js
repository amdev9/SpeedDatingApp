
// CONNECTION, MESSAGE_RECEIVED
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