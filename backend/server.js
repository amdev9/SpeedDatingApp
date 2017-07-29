import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';

import morgan from 'morgan';
import router from './router';

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

// // Set up comment routes
// app.route('/comments')
//   .get(list)
//   .put(create);

// Logger that outputs all requests into the console
app.use(morgan('combined'));
// Use v1 as prefix for all API endpoints
app.use('/v1', router);


// Launch the server on the port 3000
const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});