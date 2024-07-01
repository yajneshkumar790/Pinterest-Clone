const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  image: String,
  description: String,
  title: String
}, {
    timestamps: true  // Automatically creates `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('Post', postSchema);
