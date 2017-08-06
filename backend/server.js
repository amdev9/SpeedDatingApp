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

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/events', {
  // mongodb://localhost/react-native-comments
  useMongoClient: true,
  /* other options */
});

// Initialize http server
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
// Use v1 as prefix for all API endpoints

import router from './router';

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
        // res.download(genres.path);
        res.contentType('image/png');
        res.send(fs.readFileSync(genres.path));
    });
});


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


function mainLogic(ws, obj) {
  // add command - 'calculate'
  if (obj.command == 'start') {

    // {
    //   command: "start",
    //   timeout: 10,
    //   talk_time: 20,
    //   count_pair: 10
    // }
            
    var counter = 0;
    ws.send("Counter is: " + counter);
    // ticker
    var seconds = 0;
    ws.send('- ' + seconds + ' -')
    var ticker = setInterval(function () {
        seconds++;
        ws.send('- ' + (seconds-counter*(obj.timeout + obj.talk_time)) + ' -')
    }, 1000);

    // first timeout
    setTimeout(function() {
        ws.send('timeout ' + counter )
    }, obj.talk_time * 1000);

    var looper = setInterval(function() { 
        // console.log('setInterval inside ')
        var timer = setTimeout(function() {
            ws.send('timeout ' + counter)
        }, obj.talk_time * 1000);
        counter++;
        ws.send("Counter is: " + counter);
        if (counter >= obj.count_pair )
        {
            clearInterval(looper);
            clearTimeout(timer);
            clearTimeout(ticker);
            ws.send("last"); // Counter: " + counter + " is 
        }
    }, (obj.timeout + obj.talk_time) * 1000 );



  } else if (obj.command == 'calculate') {
    ws.send("sympathy results");
  }
}

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


// Launch the server on the port 3000
server.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});