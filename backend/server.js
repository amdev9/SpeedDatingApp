import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import morgan from 'morgan';
import fs from 'fs';
import http from 'http';
import WebSocket from 'ws';
import path from 'path';
import _ from 'lodash';

import {
  facebookLogin,
  facebookMiddleware,
  vkontakteLogin,
  vkontakteMiddleware,
  oauthCallback,
} from './controllers/auth';


import Event from './models/event';
import Person from './models/person';

import router from './router';

var CLIENTS_QUEUE = [];

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/events', {
  useMongoClient: true
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up auth routes
app.get('/auth/facebook', facebookLogin);

app.get('/auth/vkontakte', vkontakteLogin);

app.get('/auth/facebook/callback', facebookMiddleware, oauthCallback);

app.get('/auth/vkontakte/callback', vkontakteMiddleware, oauthCallback);

app.get('/logout', function(req, res) {
    req.logout();
    // res.redirect('/');
    res.json("ok");
});

// Logger that outputs all requests into the console
app.use(morgan('combined'));

app.use('/v1', router);


// admin website part 

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/admin', async (req, res) => {
    // add auth with login and password
    var events = await Event.find().exec();
    var persons = await Person.find().exec();
    // console.log("\n----------- wss: ", wss);
    res.render('index', { 
      title: 'Express',
      events: JSON.parse(JSON.stringify(events)),
      persons: JSON.parse(JSON.stringify(persons))
    }); // callback for renders
    // wss.broadcast( JSON.stringify(msg) );  // msg - updated event
    
});

app.get('/images', function(req, res) {
    router.getImages(function(err, genres) {
        if (err) {
            throw err;
        }
        res.json(genres);
    });
});

// uncomment and fix error
app.get('/images/:id', function(req, res) {
    router.getImageById(req.params.id, function(err, genres) {
        if (err) { throw err; }
        res.contentType('image/png');
        res.send(fs.readFileSync(genres.path));
    });
});

const server = http.createServer(app);
export const wss = new WebSocket.Server({ server });

function start(ws, obj) {
    CLIENTS_QUEUE = [];
    var counter = 0;
    var selected = JSON.stringify({
        type: "selected",
        data: obj.selected
    });
    next = () => { 
        var parsed = JSON.parse(obj.selected);
        parsed.map((participant, index) => {
            if (participant.table == obj.event.table_max) {
                participant.table = 1;
            } else {
                participant.table++;
            }
            return participant;
        });

        return JSON.stringify({
            type: "next", 
            data: obj.selected
            // add current table info
        });
    }
    var last = JSON.stringify({
        type: "last",
        data: obj.selected
    });

    timeout = (counter) => {
        return JSON.stringify({
          type: "timeout",
          counter: counter
          // send next table number
        });
    }
    tick = (seconds) => {
        return JSON.stringify({
          type: "tick",
          seconds: seconds
        });
    }
    wss.broadcast(selected);
    wss.broadcast(next() );
    var seconds = 0;
    wss.broadcast(tick(seconds));
    var ticker = setInterval(function () {
        seconds++;
        wss.broadcast(  tick(seconds-counter*(obj.timeout + obj.talk_time)) )
    }, 1000);

    setTimeout(function() {
        wss.broadcast( timeout(counter) )
    }, obj.talk_time * 1000);

    var looper = setInterval(function() { 
        var timer = setTimeout(function() {
            wss.broadcast( timeout(counter) )
        }, obj.talk_time * 1000);
        counter++;
        
        if (counter >= JSON.parse(obj.selected).length - 1 ) 
        {
            clearInterval(looper);
            clearTimeout(timer);
            clearTimeout(ticker);
            wss.broadcast(last); 
        } else {

            wss.broadcast(next()); // change to function next() --> table auto increment
        }
    }, (obj.timeout + obj.talk_time) * 1000 );
}

function connected(ws, obj) {
    var connected = JSON.stringify({
        type: "connected", 
        data: obj.data
        // add table number
    });
    wss.broadcast(connected); 

    // save obj.data to queue
    // if (!_.some(CLIENTS_QUEUE, obj.data)) {
      CLIENTS_QUEUE.push(obj.data);
    // }
}

function closed(ws, obj) {
    var closed = JSON.stringify({
        type: "closed", 
        data: obj.data
    });
    wss.broadcast(closed); 
    // remove obj.data to queue
    // if (_.some(CLIENTS_QUEUE, obj.data)) {
        _.remove(CLIENTS_QUEUE, obj.data);
    // }
}

function clients_queue(ws, obj) {
    var response_queue = JSON.stringify({
        type: "response_queue", 
        data: CLIENTS_QUEUE
    });

    console.log('----- before broadcast response_queue ---')
    wss.broadcast(response_queue);
}

function calculate(ws, obj) {
    // search event by id and get likes
    const participantsRelation = {
        path: 'participants', 
        select: ['name', 'avatar', 'likes'],
        model: 'Person',
    };
    Event.findById(obj.event_id).populate(participantsRelation).exec( function (err, event) { // Event.findById(obj.event_id, function (err, event) {
        if (err) {
        console.log(err);
        }
        console.log('--likes----> ', event.likes);    
        let matches = {};
        event.likes.forEach( (object) => {
            // console.log('--trace----> ', object)
            // person_likes contains wrong!
            object.person_likes.forEach( (id) => {
                event.likes.forEach( (next) => {
                    if(next.person_id == id) {
                        if( next.person_likes.includes(object.person_id) ) {
                            if (!matches[object.person_id]) {
                                //  || !Array.isArray(matches[object.person_id])
                                matches[object.person_id] = [];
                            }
                            matches[object.person_id].push(id);
                            // console.log('matches --> ',object.person_id, id);
                        }
                    }
                })
            })
        })

        // console.log(event.participants);
        // console.log(matches);
        // from array of ids to array of objects obj.selected
        for (var key in matches) {
            var key_index = _.findIndex(event.participants, function(o) { return o._id == key; });
            matches[key].forEach( (item, i , arr) => {
                var index = _.findIndex(event.participants, function(o) { return o._id == item; });
                arr[i] =  event.participants[index];
            })
            matches[key].unshift(event.participants[key_index]);
        }
        var calculate = JSON.stringify({
            type: "calculate",
            data: JSON.stringify(matches)
        });
        // console.log(calculate)
        wss.broadcast(calculate);
    });
}

function events_decision(ws, obj) {
    const eventId = obj.eventId;
    const decision = obj.decision;
    const manageQueueId = obj.manageQueueId;

    
    Event.findById(eventId, function (err, event) {
        if (err) {
            console.log(err);
        }
        if (decision == 'approve') {
            let position = event.manage_queue_ids.indexOf(manageQueueId);
            if ( ~position ) event.manage_queue_ids.splice(position, 1);
            event.manage_ids.push(manageQueueId);
            event.show_manage = false;
        } else if (decision == 'decline') {  
            let position = event.manage_queue_ids.indexOf(manageQueueId);
            if ( ~position ) event.manage_queue_ids.splice(position, 1);
            event.manage_decline_ids.push(manageQueueId);
        }
        event.save(function (err, updatedEvent) {
            if (err) {
                console.log(err);
            }
            // + push notification 
            var event_decision = JSON.stringify({
                type: "EVENT_DECISION",
                decision: decision,
                event: JSON.stringify(updatedEvent)
            });
            wss.broadcast(event_decision);
        });
    });
}

function events_list(ws, obj) {
    const managerRelation = {
        path: 'manage_ids',  
        select: ['name', 'avatar'],
        model: 'Person',
    };
    const participantsRelation = {
        path: 'participants', 
        select: ['name', 'avatar', 'likes'],
        model: 'Person',
    };
    Event.find().populate(participantsRelation).populate(managerRelation).exec(function(err, events ) {

        ws.send(JSON.stringify({  // change to send
            type: "EVENTS_LIST", 
            events: JSON.stringify(events)
        }));
    });
}

function likes(ws, obj) {
    const likes = obj.likes;
    const person_id = obj.person_id;
    const event_id = obj.event_id;
    Event.findById(event_id, function (err, event) {
      if (err) {
        console.log(err);
      }
  
      // event.likes check if contains
  
      var obj = {};
      obj.person_id = person_id;
      obj.person_likes = likes;
  
      if (event.likes.length > 0) {
        if ( !_.map(event.likes, 'person_id').includes(person_id) ) {
          event.likes.push(obj);
        }
      } else {
        event.likes.push(obj);
      }
      
      event.save(function (err, updatedEvent) {
        if (err) {
          console.log(err);
        }
        // make broadcast request
        var likes_post = JSON.stringify({
          type: "likes_post",
          data: JSON.stringify(obj)
        });
        wss.broadcast(likes_post); // fix to send ?
        
        // res.send(updatedEvent);
      });
    });  
}

function update_user(ws, obj) {
// export const update_user = async (req, res) => {

    //  const { user } = req.body;

    const user = obj.user;
    
     Person.findById(user._id, function (err, person) {
       if (err) {
         console.log(err);
       }
       
       person.current_work = user.current_work;
       person.about = user.about;
       person.age = user.age;
       person.avatar = user.avatar;
       
       person.save(function (err, updatedPerson) {
         if (err) {
           console.log(err);
         }
        //  res.send(updatedPerson);
       });
     });
}

function update_event(ws, obj) { 
    const event_id = obj.event_id;
    const participant_id = obj.participant_id;
    const participantsRelation = {
        path: 'participants', 
        select: ['name', 'avatar', 'likes'],
        model: 'Person',
    };
    Event.find().populate(participantsRelation).exec( function(err, events) {  
        if (err) {
            console.log(err);
        }
        let event = _.find(events, function(obj) { return obj._id == event_id })
        event.participant_ids.push(participant_id);
        event.participants.push(participant_id);
        event.save(function (err, updatedEvent) {
            ws.send(JSON.stringify({ 
                type: "EVENTS_LIST", 
                events: JSON.stringify(events)
            })); 
        });
    });
}

function manage_event(ws, obj) {  
    const person_id = obj.person_id;
    const event_id = obj.event_id;
    const participantsRelation = {
        path: 'participants', 
        select: ['name', 'avatar', 'likes'],
        model: 'Person',
    };
    Event.find().populate(participantsRelation).exec( function(err, events) {  
        if (err) {
            console.log(err);
        }
        let event = _.find(events, function(obj) { return obj._id == event_id });
        event.manage_queue_ids.push(person_id); 
        event.save(function (err, updatedEvent) {
            if (err) {
            console.log(err);
            }
            ws.send(JSON.stringify({ 
                type: "EVENTS_LIST", 
                events: JSON.stringify(events)
            })); 
        });
    });
}

function mainLogic(ws, obj) { 
  switch(obj.command) {
      case 'start': start(ws, obj); break;
      case 'connected': connected(ws, obj); break;
      case 'closed': closed(ws, obj); break;
      case 'clients_queue': clients_queue(ws, obj); break;
      case 'calculate': calculate(ws, obj); break;
      case 'events_decision': events_decision(ws, obj); break;
      case 'events_list': events_list(ws, obj); break;
      case 'update_event': update_event(ws, obj); break;
      case 'manage_event': manage_event(ws, obj); break;
      case 'likes': likes(ws, obj); break;
      case 'update_user': update_user(ws, obj); break;
      default: 
        console.log('command not found');
  }
}

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

wss.on('connection', function connection(ws, req) {
  // const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    var obj = JSON.parse(message); 
    
    mainLogic(ws, obj);
  });
});

server.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});