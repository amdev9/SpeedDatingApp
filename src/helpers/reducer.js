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

      case 'WEBSOCKET:RESPONSE_QUEUE':
        // obj.data.map( (partic)=> {
        //   this.state.participants.push(partic);
        // })
        // this.setState({
        //   participants: this.state.participants
        // })
        return {}

      case 'WEBSOCKET:CONNECTED': 
        // this.state.participants.push(obj.data);
        // this.setState({
        //   participants: this.state.participants
        // })
        return {}

      case 'WEBSOCKET:CLOSED': 
        return {}

      case 'WEBSOCKET:SELECTED':
        // var selected_data = JSON.parse(obj.data);
        // this.setState({
        //   selected: selected_data
        // })
        return {}

      case 'WEBSOCKET:LIKES_POST':
        // this.state.participants.map( (participant) => {
        //           if (participant._id == lik.person_id) {
        //             participant.likes = {
        //               person_id: lik.person_id,
        //               person_likes: lik.person_likes
        //             };
        //           }
        //           return participant; 
        //         })
        // this.setState({
        //   participants: this.state.participants
        // });
        return {}
      case 'WEBSOCKET:NEXT': 
        // for (var i = 0; i < participant.length; i++) {
        //   if (participant[i]._id == this.props.navigation.state.params.person._id) {
        //     participant.splice(i, 1); 
        //     break;
        //   }
        // }
        // this.setState({
        //   participant: participant[this.state.index]
        // })
        return {}
      case 'WEBSOCKET:LAST': 
        // var selected_data = JSON.parse(obj.data);
        // this.setState({
        //   selected: selected_data
        // });
        return {};
        
      default:
        return state
    }
}