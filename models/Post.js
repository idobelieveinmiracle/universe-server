const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const PostSchema = new Schema({
  ofUser: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  likes: {
    type: [String],
    default: []
  },
  comments: {
    type: [CommentSchema],
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
