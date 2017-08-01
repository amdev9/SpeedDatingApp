import Event from '../models/event';
 
// User relation for .populate()
const creatorRelation = {
  path: '_creator', // ['participants', 
  select: ['name', 'avatar'],
  model: 'Person',
};

const participantsRelation = {
  path: 'participants', 
  select: ['name', 'avatar'],
  model: 'Person',
};


// List existing comments
export const list = async (req, res, next) => {
  // Get all comments and populate User models
  const events = await Event.find()
    // .sort({ 'created': -1 })
    .populate(creatorRelation)
    .populate(participantsRelation)
    .exec();

  res.json({
    events
  });
};

export const create = async (req, res, next) => {
  const { event_id, participant_id } = req.body;
  Event.findById(event_id, function (err, event) {
    if (err) {
      console.log(err);
    }
    if ( typeof event.participants !== 'undefined' && event.participants.length > 0 &&  event.participants.indexOf(participant_id) > -1) {
      res.send(event);
    } else {
      event.participants.push(participant_id);
      event.save(function (err, updatedEvent) {
        if (err) {
          console.log(err);
        }
        res.json({
          updatedEvent
        });
        // res.send(updatedEvent);
      });
    }
  });
};


// 
  // // Save comment
  // const comment = await new Comment({
  //   user: user_id,
  //   content: content,
  //   created: new Date,
  // }).save();

  // res.json({
  //   // Get the comment and populate User model
  //   comment: await Comment.findById(comment._id)
  //     .populate(userRelation)
  //     .exec()
  // });




// ///////

// // Hardcode the days for the sake of simplicity
// const days = [ 'Today', 'Tomorrow', moment().add(2, 'days').format('ddd, MMM D') ];
// // Same for the times
// const times = [ '9:00 AM', '11:10 AM', '12:00 PM', '1:50 PM', '4:30 PM', '6:00 PM', '7:10 PM', '9:45 PM' ];

// export const index = (req, res, next) => {
//   // Find all movies and return json response
//   Movie.find().lean().exec((err, movies) => res.json(
//     // Iterate through each movie
//     { movies: movies.map(movie => ({
//       ...movie,
//       days,     // and append days
//       times,    // and times to each
//     }))}
//   ));
// };

