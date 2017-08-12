import mongoose from 'mongoose';
import Event from './models/event';
import Person from './models/person';
import assert from 'assert';


handleError = (err) => {
  console.log(err);
}

mongoose.connect('mongodb://localhost/events', {
  useMongoClient: true,
  /* other options */
});
 
const organizer = new Person ({
  oauth_id: '12312312113',
  name: 'testname',
  avatar: 'https://i.imgur.com/po7UezG.jpg',
  age: '24',
  gender: 1,
  likes: {},
  events: []
});

organizer.save(function (err) {
  let manage_ids = [];
  manage_ids.push(organizer._id);

  if (err) return handleError(err);
  var event = new Event({
    title: "Once upon a timex.",
    _creator: organizer._id,    // assign the _id from the person
    photo : 'https://i.imgur.com/po7UezG.jpg',
    description: 'Some description', 
    date : Date.now(),
    show_manage: true,
    manage_ids: manage_ids,
    participant_ids: [],
    participants: [],
    likes: [],
    matches: {}
  });

  event.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});
 