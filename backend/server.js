import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import morgan from 'morgan';
import fs from 'fs';
import http from 'http';
import WebSocket from 'ws';

import {
  facebookLogin,
  facebookMiddleware,
  googleLogin,
  googleMiddleware,
  vkontakteLogin,
  vkontakteMiddleware,
  oauthCallback,
} from './controllers/auth';
import { list } from './controllers/events';
import Event from './models/event';
import router from './router';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/events', {
  useMongoClient: true
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up auth routes
app.get('/auth/facebook', facebookLogin);
app.get('/auth/google', googleLogin);
app.get('/auth/vkontakte', vkontakteLogin);

app.get('/auth/facebook/callback', facebookMiddleware, oauthCallback);
app.get('/auth/google/callback', googleMiddleware, oauthCallback);
app.get('/auth/vkontakte/callback', vkontakteMiddleware, oauthCallback);

 
// Logger that outputs all requests into the console
app.use(morgan('combined'));


app.use('/v1', router);

app.get('/images', function(req, res) {
    router.getImages(function(err, genres) {
        if (err) {
            throw err;
        }
        res.json(genres);
    });
});

app.get('/images/:id', function(req, res) {
    router.getImageById(req.params.id, function(err, genres) {
        if (err) { throw err; }
        res.contentType('image/png');
        res.send(fs.readFileSync(genres.path));
    });
});


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


function mainLogic(ws, obj) {
wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        // client.send(message);
     
  if (obj.command == 'start') {
    var counter = 0;
    
    var selected = JSON.stringify({
        type: "selected",
        data: obj.selected
    });
    var next = JSON.stringify({
        type: "next"
    });
    var last = JSON.stringify({
        type: "last"
    });
    timeout = (counter) => {
        return JSON.stringify({
          type: "timeout",
          counter: counter
        });
    }
    tick = (seconds) => {
        return JSON.stringify({
          type: "tick",
          seconds: seconds
        });
    }
    
    client.send(selected);
    client.send(next);
    var seconds = 0;
    client.send(tick(seconds));
    var ticker = setInterval(function () {
        seconds++;
        client.send(  tick(seconds-counter*(obj.timeout + obj.talk_time)) )
    }, 1000);

    setTimeout(function() {
        client.send( timeout(counter) )
    }, obj.talk_time * 1000);

    var looper = setInterval(function() { 
        var timer = setTimeout(function() {
            client.send( timeout(counter) )
        }, obj.talk_time * 1000);
        counter++;
        
        if (counter >= JSON.parse(obj.selected).length )
        {
            clearInterval(looper);
            clearTimeout(timer);
            clearTimeout(ticker);
            client.send(last); // return all participants for VotePushScreen
        } else {
            client.send(next); // return new participant for VotingScreen
        }
    }, (obj.timeout + obj.talk_time) * 1000 );
    
  } else if (obj.command == 'calculate') {
    
    // search event by id and get likes
    Event.findById(obj.event_id, function (err, event) {
        if (err) {
        console.log(err);
        }
        // console.log(event.likes);    
        let matches = {};
        event.likes.forEach( (obj) => {
            obj.person_likes.forEach( (id) => {
                event.likes.forEach( (next) => {
                    if(next.person_id == id) {
                        if( next.person_likes.includes(obj.person_id) ) {
                            matches[obj.person_id] = [];
                            matches[obj.person_id].push(id);
                            // console.log('matches --> ',obj.person_id, id);
                        }
                    }
                })
            })
        })
        client.send(JSON.stringify(matches));
    });
  }


   }
    });

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

    
    ///////////////////////////////
    // broadcast
    // wss.clients.forEach(function each(client) {
    //   if (client !== ws && client.readyState === WebSocket.OPEN) {
    //     client.send(message);
    //   }
    // });
    ///////////////////////////////

  });
});


// Launch the server on the port 3000
server.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});