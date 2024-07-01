const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Pinterest-Clone-db")

const userSchema = new Schema({
  username: String,
  password: String,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' 
  }],
  boards: {
    type: Array,
    default: []
  },
  profileImage: String, // URL to display profile image
  email: String,
  fullname: {
    type: String,
    required: true
  },
  contact: Number
}, {
  timestamps: true  // Automatically creates `createdAt` and `updatedAt` fields
});

userSchema.plugin(plm);  // plm - passport local mongoose


module.exports = mongoose.model('User', userSchema);
