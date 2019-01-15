const express = require('express');
const router = express.Router();
const User = require('../models/User');

// get list of ninjas from database
router.get('/', function(req, res, next){
  User.find({})
    .then(users => res.send(users.map(user => {
      user.password = "";
      return user;
    })))
    .catch(next);
});

// find user
router.get('/find/:keyword', function(req, res, next){
  console.log(req.params.keyword);
  User.find({
    username: {
      $regex: req.params.keyword,
      $options: 'i'
    }
  })
    .then(users => res.send(users.map(user => {
      user.password = "";
      return user;
    })))
    .catch(next);
});

// get one user
router.get('/:username', function(req, res, next){
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

// add friend
router.put('/accreq/:username', function(req, res, next){
  const { username, password } = req.body;
  const acc = req.params.username;

  User.findOne({username, password})
    .then((user) => {
      if (!user) return res.send();

      if (user.friendRequests.find(rq => rq == acc)){

        user.friendRequests = user.friendRequests.filter(rq => rq != acc);
        user.friends.push(acc);
        user.save((err) => {
          if (err) return next(err);
          else {
            User.findOne({username: acc})
              .then(us => {
                if (!us) return res.send();
                us.friendRequests = us.friendRequests.filter(rq => rq != acc);
                us.friends.push(username);
                us.save((err, updated) => {
                  if (err) return next(err);
                  else res.send([updated, user]);
                });
              }).catch(next);
          }
        });
      } else res.send();
    }).catch(next);
});

// remove friend
router.put('/rmfr/:username', (req, res, next) => {
  const {username, password} = req.body;
  const rmfr = req.params.username;

  User.findOne({username, password})
    .then(user => {

      if (!user) return res.send();

      if (user.friends.find(fr => fr == rmfr)){
        
        user.friends = user.friends.filter(fr => fr != rmfr);

        user.save(err => {
          if(err) return next(err);
          else {

            User.findOne({username: rmfr})
              .then(us => {

                if(!us) return res.send();

                us.friends = us.friends.filter(fr => fr != username);

                us.save(err => {
                  if (err) return next(err);
                  else res.send([user, us]);
                });

              }).catch(next);

          }
        });
      } else res.send();

    }).catch(next);
});

// send friend request
router.put('/requestfr/:username', function(req, res, next){
  const requester = req.body;
  const username = req.params.username;

  User.findOne({
    username: requester.username,
    password: requester.password
  }).then(() => {
    User.findOne({username}).then((user) => {
      if (!(user.friendRequests.find((rq) => rq == requester.username))) {
        const newList = [...user.friendRequests, requester.username];
        user.friendRequests = newList;
        user.save((err, updatedUser) => {
          if (err) return next(err);
          else res.send(updatedUser);
        });
      } else res.send(user);
      
    }).catch(next);
  }).catch(next);
});

// remove request
router.put('/removereq/:username', function(req, res, next){
  const {username, password} = req.body;
  const rmuser = req.params.username;

  User.findOne({username, password})
    .then((user) => {
      const newList = user.friendRequests.filter(rq => rq != rmuser);
      user.friendRequests = newList;
      user.save((err, updatedUser) => {
        if (err) return next(err);
        else res.send(updatedUser);
      }); 
    }).catch(next);
});

// add new user to the db
router.post('/', function(req, res, next){
  console.log(req.body);
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
