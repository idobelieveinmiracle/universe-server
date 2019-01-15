const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');

router.get('/', (req, res, next) => {
  const { username, password } = req.body;

  User.findOne({username, password})
    .then(user => {
      if (!user) return res.send();

      const list = [...user.friends, user.username];

      // console.log(list);

      Post.find({ofUser: {$in: list}})
        .then(posts => {
          posts.sort((a, b) =>  (b.date - a.date));
          res.send(posts);
        })
        .catch(next);
    }).catch(next);

});

router.post('/', (req, res, next) => {
  const { username, password } = req.body.user;
  const post = req.body.post;

  User.findOne({username, password})
    .then(user => {
      if (!user) return res.send();

      post.ofUser = username;

      Post.create(post)
        .then(post => {
          user.postsId.push(post._id);
          user.save(err => {
            if (err) return next(err);
            else res.send(post);
          });
        }).catch(next);
    }).catch(next);

});

router.put('/:id', (req, res, next) => {
  const {username, password} = req.body.user;
  const content = req.body.content;
  const {id} = req.params;

  User.findOne({username, password})
    .then(user => {
      if (!user) return res.send();

      if (user.postsId.find(postId => id == postId)){
        Post.findByIdAndUpdate(id, {content})
          .then(post => res.send(post))
          .catch(next);
      } else res.send();
      
    }).catch(next);
});

router.delete('/:id', (req, res, next) => {  
  const {username, password} = req.body;
  const {id} = req.params;

  User.findOne({username, password})
    .then(user => {
      if (!user) return res.send();

      if (user.postsId.find(postId => id == postId)){
        Post.findByIdAndDelete(id)
          .then(post => res.send(post))
          .catch(next);
      } else res.send();
    }).catch(next);
});

router.put('/like/:id', (req, res, next) => {
  const {username, password} = req.body;
  const {id} = req.params;

  User.findOne({username, password})
    .then(user => {
      if (!user) return res.send();
      Post.findById(id).then(post => {
        if (!post.likes.find(like => like == username)) {
          post.likes.push(username);
          post.save((err, updated) =>{
            if (err) return next(err);
            else res.send(updated);
          });
        } else return res.send();
      }).catch(next);
    }).catch(next);
});

router.put('/comment/:id', (req, res, next) => {
  const {username, password, content} = req.body;
  const {id} = req.params;

  User.findOne({username, password})
    .then(user => {
      if (!user) return res.send();

      Post.findById(id).then(post => {
        post.comments.push({
          username,
          content
        });

        post.save((err, updated) => {
          if (err) return next(err);
          else res.send(updated);
        });
      }).catch(next);
    }).catch(next);
});

module.exports = router;