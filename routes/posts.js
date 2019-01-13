const express = require('express');
const router = express.Router();

// get list of ninjas from database
router.get('/', function(req, res, next){
  Post.find({})
    .then(ninjas => res.send(ninjas))
      .catch(next);
});

// add new ninja to the db
router.post('/', function(req, res, next){
  Post.create(req.body)
    .then(ninja => res.send(ninja))
      .catch(next);  
});

// update a ninja in the db
router.put('/:id', function(req, res, next){
  Post.findByIdAndUpdate({_id: req.params.id}, req.body)
    .then(() => Ninja.findOne({_id: req.params.id})
      .then(ninja => res.send(ninja)))
        .catch(next);
});

//  delete a ninja in the database
router.delete('/:id', function(req, res, next){
  Post.findByIdAndRemove({_id: req.params.id})
    .then(ninja => res.send(ninja))
      .catch(next);
});

module.exports = router;