import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import morgan from 'morgan';


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




// Launch the server on the port 3000
const server = app.listen(3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});