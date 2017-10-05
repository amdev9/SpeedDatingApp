export default  reducer = (state = { events: [], loading: true, participants: [], selected: [], person: null }, action) => {
    
 
    function remove(array, element) {
      var index = array.indexOf(element);
      if(index!== -1) {
        var arr2 = array.slice(1, index+1);
        return arr2;
      }
    }
    
    function add(array, element) {
      var final = array.concat(element);  
      return final;
    }

    switch (action.type) {
  
      case 'WEBSOCKET:EVENT_DECISION':
        let updatedEvent = JSON.parse(action.payload.data.event);  
        return { 
          ...state, 
          loading: false, 
          events: state.events.map(
              (event, i) => event._id === updatedEvent._id ? updatedEvent
                                      : event
          )
        }
       
      case 'WEBSOCKET:EVENTS_LIST':
        let data_events = JSON.parse(action.payload.data.events); 
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
        const data = action.payload.data.data;
        return {
          ...state,
          participants: state.participants.concat(data)  
        }
    
      case 'WEBSOCKET:CONNECTED': 
        const user = action.payload.data.data;
        return {
          ...state,
          participants: state.participants.concat(user)  
        }
      
      case 'WEBSOCKET:CALCULATE_ON_SELECTED':
        let participant = action.participant;
        if (state.selected.includes(participant)) {
          return {
            ...state,
            selected: remove(state.selected, participant)
          }
        } else {
          return {
            ...state,
            selected: add(state.selected, participant)
          }
        }
      
      case 'WEBSOCKET:CREATED_USER':
        let createdUser = JSON.parse(action.payload.data.user); 
        return {
          ...state,
          person: createdUser
        }

      default: {
        return {
          ...state
        }
      }
         
      // case 'WEBSOCKET:NEXT': 
        
      //   // add index!!!

      //   var participant = JSON.parse(obj.data);
      //   for (var i = 0; i < participant.length; i++) {
      //     if (participant[i]._id == this.props.navigation.state.params.person._id) {
      //       participant.splice(i, 1); 
      //       break;
      //     }
      //   }
      //   // this.setState({
      //   //   participant: participant[this.state.index]
      //   // })
      //   // const { navigate } = this.props.navigation;
      //   // navigate('Voting', {
      //   //   participant: this.state.participant,
      //   //   person: this.props.navigation.state.params.person
      //   // });  
      //   // this.state.index++;
      //   return {
      //     ...state,

      //   }

     

      

      // case 'WEBSOCKET:CLOSED': 
      //   let data = JSON.parse(action.payload.data);
      //   // for (var i = 0; i < this.state.participants.length; i++) {
      //   //   if (this.state.participants[i]._id == obj.data._id) {
      //   //     this.state.participants.splice(i, 1); 
      //   //     break;
      //   //   }
      //   // }
      //   // this.setState({
      //   //   participants: this.state.participants
      //   // })
      //   return {
      //     ...state,
      //     participants: state.participants.filter(
      //       (participant) => participant._id === data._id
      //     )
      //   }

      // case 'WEBSOCKET:SELECTED':
      // let selected_data = action.payload.data.data;
      // // var selected_data = JSON.parse(obj.data);
      // // this.setState({
      // //   selected: selected_data
      // // })
      // // const { navigate } = this.props.navigation;
      // // navigate('VotingStatus', {
      // //   participants: this.state.selected,
      // //   person: this.props.navigation.state.params.person,
      // //   event: this.props.navigation.state.params.event
      // // });    
      // return {
      //   ...state,
      //   selected: selected_data
      // }
    
      // case 'WEBSOCKET:LIKES_POST':
      //   let data = JSON.parse(action.payload.data);
      //   // var lik = JSON.parse(obj.data);
      //   // this.state.participants.map( (participant) => {
      //   //           if (participant._id == lik.person_id) {
      //   //             participant.likes = {
      //   //               person_id: lik.person_id,
      //   //               person_likes: lik.person_likes
      //   //             };
      //   //           }
      //   //           return participant; 
      //   //         })
      //   // this.setState({
      //   //   participants: this.state.participants
      //   // });
      //   return {
      //     ...state, 
      //     participants: state.participants.map(
      //       (participant) => {
      //         if (participant._id == data.person_id) {
      //           participant.likes = {
      //             person_id: data.person_id,
      //             person_likes: data.person_likes
      //           };
      //         }
      //         return participant; 
      //       }
      //     )
      //   }

      

      // case 'WEBSOCKET:LAST': 
      //   let data = JSON.parse(action.payload.data);
      //   // var selected_data = JSON.parse(obj.data);
      //   // this.setState({
      //   //   selected: selected_data
      //   // });
      //   // const { navigate } = this.props.navigation;
      //   // navigate('VotePush', {
      //   //   participants: this.state.selected,  
      //   //   person: this.props.navigation.state.params.person,
      //   //   event: this.props.navigation.state.params.event
      //   // });  
      //   return {
      //     ...state,
      //     selected: data
      //   };
      
      // case 'WEBSOCKET:CALCULATE_CLIENT':
      //   let data = JSON.parse(action.payload.data);
      //   // var founded = JSON.parse(obj.data); 
      //   // for (var key in founded ) {
      //   //   if (person._id == key) {
      //   //     founded[key].shift();  
      //   //     founded[key].forEach( (item) => {
      //   //       if(!_.some(this.state.persons, item) ) {
      //   //         this.state.persons.push(item);
      //   //       }
      //   //     })
      //   //     this.saveData(this.state.persons).done()
      //   //     this.setState({
      //   //       persons: this.state.persons
      //   //     })
      //   //   }      
      //   // }
      //   return {
      //     ...state,
      //     persons: data
      //   };

      // case 'WEBSOCKET:CALCULATE_MANAGER':
      //   let data = JSON.parse(action.payload.data);
      //   // var obj = JSON.parse(e.data); 
      //   // const { navigate } = this.props.navigation;
      //   // var founded = JSON.parse(obj.data);
      //   // Array.prototype.indexOfForArrays = function(search)
      //   // {
      //   //   var searchJson = JSON.stringify(search); // "[3,566,23,79]"
      //   //   var arrJson = this.map(JSON.stringify); // ["[2,6,89,45]", "[3,566,23,79]", "[434,677,9,23]"]
      //   //   return arrJson.indexOf(searchJson);
      //   // };
      //   // for (var key in founded ) { 
      //   //     founded[key].shift();  
      //   // }
      //   // var passed = [];
      //   // var final = [];
      //   // for (var key in founded ) {
      //   //     founded[key].forEach( (item) => {  // null
      //   //         founded[item._id].forEach( (found) => {
      //   //             if (found._id == key) {
      //   //                 var s = [key, item._id].sort();
      //   //                 if ( passed.indexOfForArrays(s) < 0 ) { 
      //   //                     passed.push(s);
      //   //                 } else {
      //   //                     final.push(s); // [ s, .. ]
      //   //                 }
      //   //             }
      //   //         })
      //   //     })
      //   // }
      //   // var final_ob_done = []; // array of pairs = 2 item arrays
      //   // final.forEach( (fin) => {
      //   //   var final_ob = [];
      //   //   for (var key in founded ) { 
      //   //       founded[key].forEach ( (it) => {
      //   //           if ( fin.indexOf(it._id) > -1 ) {
      //   //             var ind = fin.indexOf(it._id);
      //   //             fin.slice(ind , 1);
      //   //             final_ob.push(it);
      //   //           }
      //   //       })
      //   //   }
      //   //   final_ob_done.push(final_ob);
      //   // })
      //   // navigate('Match', {
      //   //   matches: final_ob_done
      //   // }); 
      //   return {
      //     ...state,
      //     matches: data
      //   };
      
     
    }
}