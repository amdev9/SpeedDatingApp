import _ from 'lodash';
export default  reducer = (state = { events: [], loading: false, participants: [], selected: [], person: null, admin_matches: [], current_user: null, vote_participant: null, vote_index: 0, vote_selected: [] }, action) => {
    
 
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
          loading: false,
          participants: state.participants.concat(data)  
        }
    
      case 'WEBSOCKET:CONNECTED': 
        const user = action.payload.data.data;
        return {
          ...state,
          loading: false,
          participants: state.participants.concat(user) 
          
          // (!state.participants.some((e) => e._id == user._id)) 
          //   ? state.participants.concat(user) 
          //   : state.participants.map(
          //     (participant, i) => participant._id === user._id ? user
          //                             : participant
          //     )
        }
      
      case 'WEBSOCKET:CLOSED': 
        console.log('CLOSED');
        let user_close = JSON.parse(action.payload.data);
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
          loading: false,
          participants: state.participants.filter(
            (participant) => participant._id === user_close._id
          )
        }

      
      case 'WEBSOCKET:CALCULATE_ON_SELECTED':
        let participant = action.participant;
        if (state.selected.includes(participant)) {
          return {
            ...state,
            loading: false,
            selected: remove(state.selected, participant)
          }
        } else {
          return {
            ...state,
            loading: false,
            selected: add(state.selected, participant)
          }
        }
      
      case 'WEBSOCKET:CREATED_USER':
        let createdUser = JSON.parse(action.payload.data.user); 
        return {
          ...state,
          loading: false,
          person: createdUser
        }

      case 'WEBSOCKET:CALCULATE_CLIENT':
        var founded = JSON.parse(action.payload.data.data);
        var founded2 = Object.assign({}, founded);
        console.log(founded2);

        Array.prototype.indexOfForArrays = function(search) {
          var searchJson = JSON.stringify(search); // "[3,566,23,79]"
          var arrJson = this.map(JSON.stringify); // ["[2,6,89,45]", "[3,566,23,79]", "[434,677,9,23]"]
          return arrJson.indexOf(searchJson);
        };
        for (var key in founded ) { 
            founded[key].shift();  
        }
        var passed = [];
        var final = [];
        for (var key in founded ) {
          founded[key].forEach( (item) => {  // null
            founded[item._id].forEach( (found) => {
              if (found._id == key) {
                var s = [key, item._id].sort();
                if ( passed.indexOfForArrays(s) < 0 ) { 
                    passed.push(s);
                } else {
                    final.push(s); // [ s, .. ]
                }
              }
            })
          })
        }
        var final_ob_done = []; // array of pairs = 2 item arrays
        final.forEach( (fin) => {
          var final_ob = [];
          for (var key in founded ) { 
            founded[key].forEach ( (it) => {
              if ( fin.indexOf(it._id) > -1 ) {
                var ind = fin.indexOf(it._id);
                fin.slice(ind , 1);
                final_ob.push(it);
              }
            })
          }
          final_ob_done.push(final_ob);
        })


        var matches_final = [];
        for (var key in founded2 ) {
          if (state.current_user._id == key) { 
            
            founded2[key].forEach( (item) => {
              console.log(item)
              if(!_.some(state.current_user.matches, item) ) {
                matches_final.push(item); 
              }
            })
          }      
        }
        const upd_matches = state.current_user.matches.concat(matches_final);
        
        return {
          ...state,
          admin_matches: final_ob_done,
          current_user: Object.assign({}, state.current_user, {
            matches: upd_matches
          })
        }

      case 'STORE_USER':
        let current_user = action.user;
        return {
          ...state,
          current_user: current_user
        }

      case 'CLEAR_ADMIN_MATCHES':
        return {
          ...state,
          participants: [],
          selected: [],
          admin_matches: [],
          vote_participant: null,
          vote_selected: [],
          vote_index: 0
        }

      case 'WEBSOCKET:LIKES_POST':
        let lik = JSON.parse(action.payload.data.data);
        return {
          ...state, 
          participants: state.participants.map(
            (participant) => {
              if (participant._id == lik.person_id) {
                participant.likes = {
                  person_id: lik.person_id,
                  person_likes: lik.person_likes
                };
              }
              return participant; 
            }
          )
        }

      case 'WEBSOCKET:NEXT': 
        const participants = JSON.parse(action.payload.data.data);
        const participants_filtered = participants.filter(participant => participant._id !== state.current_user._id);
        return {
          ...state,
          vote_participant: participants_filtered[state.vote_index],
          vote_index: state.vote_index++,
          vote_selected: []
        }

      case 'WEBSOCKET:LAST': 
        const selected = JSON.parse(action.payload.data.data);
        const selected_filtered = selected.filter(select => select._id !== state.current_user._id);
        return {
          ...state,
          vote_selected: selected_filtered,
        };

      default: {
        return {
          ...state,
          loading: false
        }
      }
    }
}