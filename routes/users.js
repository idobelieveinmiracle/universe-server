const express = require('express');
const router = express.Router();
const User = require('../models/user');

// get list of ninjas from database
router.get('/all', function(req, res, next){
  User.find({})
    .then(users => res.send(users.map(user => {
      user.password = "";
      return user;
    })))
    .catch(next);
});

// get one user
router.get('/profile/:username', function(req, res, next){
  User.findOne({username: req.params.username})
    .then(user => {
      user.password = "";
      res.send(user);
    })
    .catch(next);
});

// login handling
router.post('/login', function(req, res, next){
  const {username, password} = req.body;
  User.findOne({username, password})
    .then(user => res.send(user))
    .catch(next);
});

// add new user to the db
router.post('/', function(req, res, next){
  User.create(req.body)
    .then(user => res.send(user))
    .catch(next);  
});

// update a user in the db
router.put('/:id', function(req, res, next){
  User.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(() => User.findOne({_id: req.params.id})
      .then(user => res.send(user)))
    .catch(next);
});

//  delete a user in the database
router.delete('/:id', function(req, res, next){
  User.findByIdAndRemove({_id: req.params.id})
    .then(user => res.send(user))
    .catch(next);
});

module.exports = router;