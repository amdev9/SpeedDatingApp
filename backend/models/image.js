import mongoose, { Schema } from 'mongoose';

var imageSchema = mongoose.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    originalname: {
        type: String,
        required: true
    }
});

var Image = mongoose.model('Image', imageSchema);

export default Image