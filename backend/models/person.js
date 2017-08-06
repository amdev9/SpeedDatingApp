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
  likes: Object,
  // likes: {
  //   eventID1: [ personId1, personId2, personId3 .. ],
  //   eventID2: [ personId4, personId5, personId6 .. ],
  //   ..
  // },
  events : [{ type: Schema.Types.ObjectId, ref: 'DateEvent' }]
});

var Person = mongoose.model('Person', personSchema);

export default Person