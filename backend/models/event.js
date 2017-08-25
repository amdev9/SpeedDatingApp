import mongoose, { Schema } from 'mongoose';

var eventSchema = Schema({
  _creator: { type: Schema.ObjectId, ref: 'Person' },
  title: String,
  date: Date,
  photo: String,
  description: String, 
  places_max: Number,
  cost_men: Number,
  cost_women: Number,
  show_manage: Boolean,
  
  manage_queue_ids: Array,
  manage_decline_ids: Array,
  manage_ids: Array,
  participant_ids: Array,
  participants: [{ type: Schema.ObjectId, ref: 'Person' }],  
  matches: Object,
  likes: Array,

  tables: Array

});

var DateEvent = mongoose.model('Event', eventSchema);

export default DateEvent
