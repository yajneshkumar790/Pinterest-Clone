const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Pinterest-Clone-db")

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post' 
  }],
  dp: {
    type: String,  // URL to the display picture
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type: String,
    required: true
  }
}, {
  timestamps: true  // Automatically creates `createdAt` and `updatedAt` fields
});

userSchema.plugin(plm);


module.exports = mongoose.model('User', userSchema);
