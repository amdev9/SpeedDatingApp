import mongoose, { Schema } from 'mongoose';

var eventSchema = Schema({
  _creator : { type: Schema.ObjectId, ref: 'Person' },
  title    : String,
  photo : String,
  description: String, 
  date : Date,
  organizer  : { type: Schema.ObjectId, ref: 'Person' },
  participants  : [{ type: Schema.ObjectId, ref: 'Person' }],
  matches: Object,
  likes: Array
});

var DateEvent = mongoose.model('Event', eventSchema);

export default DateEvent
