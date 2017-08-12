import Event from '../models/event';
import _ from 'lodash';
import { wss } from '../server';

// User relation for .populate()
// const creatorRelation = {
//   path: '_creator', // ['participants', 
//   select: ['name', 'avatar', 'likes'],
//   model: 'Person',
// };

// const participantsRelation = {
//   path: 'participant_ids', 
//   select: ['name', 'avatar', 'likes'],
//   model: 'Person',
// };


// List existing comments
export const list = async (req, res, next) => {
  // Get all comments and populate User models
  const events = await Event.find()
    // .sort({ 'created': -1 })
    // .populate(creatorRelation)
    // .populate(participantsRelation)
    .exec();

  res.json({
    events
  });
};

export const create = async (req, res, next) => {
  const { event_id, participant_id } = req.body;
 
  var events = await Event.find()
    // .sort({ 'created': -1 })
    // .populate(creatorRelation)
    // .populate(participantsRelation)
    .exec();

  Event.findById(event_id, function (err, event) {
    if (err) {
      console.log(err);
    }
    
    if (event.participant_ids.includes(participant_id)) {
      res.send(event);
    } else {
      event.participant_ids.push(participant_id);
      event.save(function (err, updatedEvent) {
        if (err) {
          console.log(err);
        }
        _.remove(events, { '_id': event_id});
        
        // find by event_id remove event place updatedEvent 
        res.json([
            ...events,
            updatedEvent
          ]);
        // res.send(updatedEvent);
      });
    }
  });
};

  
export const post = async (req, res, next) => {
  const { likes, person_id, event_id } = req.body;  
  // console.log(person_id, likes);
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
      wss.broadcast(likes_post);
      
      res.send(updatedEvent);
    });
  });
};


export const manage = async (req, res, next) => {
  const {  person_id, event_id } = req.body;  
  // console.log(person_id, likes);
  Event.findById(event_id, function (err, event) {
    if (err) {
      console.log(err);
    }

    event.manage_ids.push(person_id); 

    event.save(function (err, updatedEvent) {
      if (err) {
        console.log(err);
      }
      // make broadcast request // figure out
      // var likes_post = JSON.stringify({
      //   type: "likes_post",
      //   data: JSON.stringify(obj)
      // });
      // wss.broadcast(likes_post);
      
      res.send(updatedEvent);
    });
  });
};
