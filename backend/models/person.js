import mongoose, { Schema } from 'mongoose';

var personSchema = Schema({
  oauth_id: {
    type: String,
    unique: true,
    index: true,
  },
  name     : String,
  // lastname : String,
  avatar   : String,
  age      : Number,
  gender   : Number,  // (0-girl, 1-man)
  organizer_status : Boolean,
  likes: Array,
  events : [{ type: Schema.Types.ObjectId, ref: 'DateEvent' }]
});

var Person = mongoose.model('Person', personSchema);

export default Person