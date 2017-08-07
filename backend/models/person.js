import mongoose, { Schema } from 'mongoose';

var personSchema = Schema({
  oauth_id: {
    type: String,
    unique: true,
    index: true,
  },
  name     : String,
  avatar   : String,
  age      : Number,
  gender   : Number,  // (0-girl, 1-man)
  organizer_status : Boolean,
  events : [{ type: Schema.Types.ObjectId, ref: 'DateEvent' }],
  likes: Object
});

var Person = mongoose.model('Person', personSchema);

export default Person