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
        const data = JSON.parse(action.payload.data);
        // var founded = JSON.parse(obj.data); 
        // for (var key in founded ) {
        //   if (person._id == key) {
        //     founded[key].shift();  
        //     founded[key].forEach( (item) => {
        //       if(!_.some(this.state.persons, item) ) {
        //         this.state.persons.push(item);
        //       }
        //     })
        //     this.saveData(this.state.persons).done()
        //     this.setState({
        //       persons: this.state.persons
        //     })
        //   }      
        // }
        return {
          ...state,
          persons: data
        };

      case 'WEBSOCKET:CALCULATE_MANAGER':
        const data = JSON.parse(action.payload.data);
        // var obj = JSON.parse(e.data); 
        // const { navigate } = this.props.navigation;
        // var founded = JSON.parse(obj.data);
        // Array.prototype.indexOfForArrays = function(search)
        // {
        //   var searchJson = JSON.stringify(search); // "[3,566,23,79]"
        //   var arrJson = this.map(JSON.stringify); // ["[2,6,89,45]", "[3,566,23,79]", "[434,677,9,23]"]
        //   return arrJson.indexOf(searchJson);
        // };
        // for (var key in founded ) { 
        //     founded[key].shift();  
        // }
        // var passed = [];
        // var final = [];
        // for (var key in founded ) {
        //     founded[key].forEach( (item) => {  // null
        //         founded[item._id].forEach( (found) => {
        //             if (found._id == key) {
        //                 var s = [key, item._id].sort();
        //                 if ( passed.indexOfForArrays(s) < 0 ) { 
        //                     passed.push(s);
        //                 } else {
        //                     final.push(s); // [ s, .. ]
        //                 }
        //             }
        //         })
        //     })
        // }
        // var final_ob_done = []; // array of pairs = 2 item arrays
        // final.forEach( (fin) => {
        //   var final_ob = [];
        //   for (var key in founded ) { 
        //       founded[key].forEach ( (it) => {
        //           if ( fin.indexOf(it._id) > -1 ) {
        //             var ind = fin.indexOf(it._id);
        //             fin.slice(ind , 1);
        //             final_ob.push(it);
        //           }
        //       })
        //   }
        //   final_ob_done.push(final_ob);
        // })
        // navigate('Match', {
        //   matches: final_ob_done
        // }); 
        return {
          ...state,
          matches: data
        };
      
      default:
        return state
    }
}