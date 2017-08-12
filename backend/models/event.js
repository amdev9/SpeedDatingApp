import mongoose, { Schema } from 'mongoose';

var eventSchema = Schema({
  _creator: { type: Schema.ObjectId, ref: 'Person' },
  title: String,
  photo: String,
  description: String, 
  date: Date,
  show_manage: Boolean,
  manage_ids: Array,
  participant_ids: Array,
  participants: [{ type: Schema.ObjectId, ref: 'Person' }],  
  matches: Object,
  likes: Array
});



var DateEvent = mongoose.model('Event', eventSchema);

export default DateEvent
