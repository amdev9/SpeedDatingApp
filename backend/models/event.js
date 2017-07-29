import mongoose, { Schema } from 'mongoose';

var eventSchema = Schema({
  _creator : { type: Schema.ObjectId, ref: 'Person' },
  title    : String,
  photo : String,
  description: String, 
  date : Date,
  participants   : [{ type: Schema.ObjectId, ref: 'Person' }]
});

var DateEvent = mongoose.model('Event', eventSchema);

export default DateEvent
