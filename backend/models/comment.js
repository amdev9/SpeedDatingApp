import mongoose, { Schema } from 'mongoose';

// Define model schema
export const schema = new Schema({
  // References User model
  user: {
    type: Schema.ObjectId,
    ref: 'User',
  },
  content: String,
  created: Date
});

// Export Mongoose model
export default mongoose.model('Comment', schema);

