const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String
  },
  postsId: {
    type: [String],
    default: []
  },
  friends: {
    type: [String],
    default: []
  },
  friendRequests: {
    type: [String],
    default: []
  }
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
