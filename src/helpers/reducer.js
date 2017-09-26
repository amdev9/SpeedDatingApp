export default  reducer = (state = { events: [], loading: true }, action) => {
    switch (action.type) {

      case 'WEBSOCKET:EVENT_DECISION':
        const updatedEvent = JSON.parse(action.payload.data.event);  
        return { 
          ...state, 
          loading: false, 
          events: state.events.map(
              (event, i) => event._id === updatedEvent._id ? updatedEvent
                                      : event
          )
        }
       
      case 'WEBSOCKET:EVENTS_LIST':
        const data_events = JSON.parse(action.payload.data.events); 
        return {
          ...state,
          loading: false, 
          events: data_events
        }

      case 'WEBSOCKET:SENDING': 
        return { 
          ...state, 
          loading: true
        }

      default:
        return state
    }
}