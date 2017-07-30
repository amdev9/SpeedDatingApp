import mongoose from 'mongoose';
import Event from './models/event';
import Person from './models/person';
import assert from 'assert';


handleError = (err) => {
  console.log(err);
}

// mongoose.connect('mongodb://localhost/events', {
//   useMongoClient: true,
//   /* other options */
// });

var options = { promiseLibrary: require('bluebird') };
var db = mongoose.createConnection('mongodb://localhost/events', options);

 

const organizer = new Person ({
  oauth_id: '12312312113',
  name: 'testname',
  avatar: 'https://i.imgur.com/po7UezG.jpg',
  age: 24,
  gender: 1,
  organizer: true,
  likes: [],
  events: []
});

organizer.save(function (err) {
  if (err) return handleError(err);
  var event = new Event({
    title: "Once upon a timex.",
    _creator: organizer._id,    // assign the _id from the person
    photo : 'https://i.imgur.com/po7UezG.jpg',
    description: 'Some description', 
    date : Date.now(),
    participants   : []
  });

  event.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});

//   {
//     title: 'La La Land',
//     poster: 'https://i.imgur.com/po7UezG.jpg',
//     genre: 'Drama/Romance',
//   },

// events.map(data => {
//   // Initialize a model with movie data
//   const event = new Event(data);
//   // and save it into the database
//   event.save();
// });
