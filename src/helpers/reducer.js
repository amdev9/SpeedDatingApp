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
        const data = JSON.parse(action.payload.data);
        // obj.data.map( (partic)=> {
        //   this.state.participants.push(partic);
        // })
        // this.setState({
        //   participants: this.state.participants
        // })
        return {
          ...state,
          participants: [ ...state.participants, data ]
        }

      case 'WEBSOCKET:CONNECTED': 
        const data = JSON.parse(action.payload.data);
        // this.state.participants.push(obj.data);
        // this.setState({
        //   participants: this.state.participants
        // })
        return {
          ...state,
          participants: [ ...state.participants, data ]
        }

      case 'WEBSOCKET:CLOSED': 
        const data = JSON.parse(action.payload.data);
        // for (var i = 0; i < this.state.participants.length; i++) {
        //   if (this.state.participants[i]._id == obj.data._id) {
        //     this.state.participants.splice(i, 1); 
        //     break;
        //   }
        // }
        // this.setState({
        //   participants: this.state.participants
        // })
        return {
          ...state,
          participants: state.participants.filter(
            (participant) => participant._id === data._id
          )
        }

      case 'WEBSOCKET:SELECTED':
        const data = JSON.parse(action.payload.data);
        // var selected_data = JSON.parse(obj.data);
        // this.setState({
        //   selected: selected_data
        // })
        // const { navigate } = this.props.navigation;
        // navigate('VotingStatus', {
        //   participants: this.state.selected,
        //   person: this.props.navigation.state.params.person,
        //   event: this.props.navigation.state.params.event
        // });    
        return {
          ...state,
          selected: data
        }

      case 'WEBSOCKET:LIKES_POST':
        const data = JSON.parse(action.payload.data);
        // var lik = JSON.parse(obj.data);
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
        return {
          ...state, 
          participants: state.participants.map(
            (participant) => {
              if (participant._id == data.person_id) {
                participant.likes = {
                  person_id: data.person_id,
                  person_likes: data.person_likes
                };
              }
              return participant; 
            }
          )
        }

      case 'WEBSOCKET:NEXT': 
        const participant = JSON.parse(action.payload.data);
        // add index!!!

        // var participant = JSON.parse(obj.data);
        // for (var i = 0; i < participant.length; i++) {
        //   if (participant[i]._id == this.props.navigation.state.params.person._id) {
        //     participant.splice(i, 1); 
        //     break;
        //   }
        // }
        // this.setState({
        //   participant: participant[this.state.index]
        // })
        // const { navigate } = this.props.navigation;
        // navigate('Voting', {
        //   participant: this.state.participant,
        //   person: this.props.navigation.state.params.person
        // });  
        // this.state.index++;
        return {}

      case 'WEBSOCKET:LAST': 
        const data = JSON.parse(action.payload.data);
        // var selected_data = JSON.parse(obj.data);
        // this.setState({
        //   selected: selected_data
        // });
        // const { navigate } = this.props.navigation;
        // navigate('VotePush', {
        //   participants: this.state.selected,  
        //   person: this.props.navigation.state.params.person,
        //   event: this.props.navigation.state.params.event
        // });  
        return {
          ...state,
          selected: data
        };
      
      case 'WEBSOCKET:CALCULATE_CLIENT':
        // update 
        return {};

      case 'WEBSOCKET:CALCULATE_MANAGER':
        // update
        return {};
      
      default:
        return state
    }
}