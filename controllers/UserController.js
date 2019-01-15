const User = require('../models/User');

var userController;

userController.getAll = function(){
  User.find()
}

module.exports = userController;
