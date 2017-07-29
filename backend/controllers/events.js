import Event from '../models/event';

// User relation for .populate()
const personRelation = {
  path: 'person',
  select: ['name', 'avatar'],
  model: 'Person',
};

///////

// List existing comments
export const list = async (req, res, next) => {
  // Get all comments and populate User models
  const events = await Event.find()
    // .sort({ 'created': -1 })
    .populate(personRelation)
    .exec();

  res.json({
    events
  });
};

// // Create new comment
// export const create = async (req, res, next) => {
//   const { user_id, content } = req.body;
//   // Save comment
//   const comment = await new Comment({
//     user: user_id,
//     content: content,
//     created: new Date,
//   }).save();

//   res.json({
//     // Get the comment and populate User model
//     comment: await Comment.findById(comment._id)
//       .populate(userRelation)
//       .exec()
//   });
// };



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

