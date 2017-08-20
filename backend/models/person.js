import mongoose, { Schema } from 'mongoose';

var personSchema = Schema({
  oauth_id: {
    type: String,
    unique: true,
    index: true,
  },
  name     : String,
  avatar   : String,
  age      : String,
  about : String,
  current_work: String,
  gender   : Number,  //  1 - женский, 2 - мужской, 0 - без указания пола. 
  events : [{ type: Schema.Types.ObjectId, ref: 'DateEvent' }],
  likes: Object
});

var Person = mongoose.model('Person', personSchema);

export default Person