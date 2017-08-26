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
  work: Array,
  university: Array,
  gender   : Number,  //  1 - женский, 2 - мужской, 0 - без указания пола. 
  events : [{ type: Schema.Types.ObjectId, ref: 'DateEvent' }],
  likes: Object,
  // matches_list: [{ type: Schema.ObjectId, ref: 'Person' }],  
  table: Number
});

var Person = mongoose.model('Person', personSchema);

export default Person