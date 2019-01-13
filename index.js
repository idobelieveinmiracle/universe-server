const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// connect to mongodb
mongoose.connect('mongodb://test:hung123@ds137703.mlab.com:37703/quochungdb');
mongoose.Promise = global.Promise;

// some middlewares
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(bodyParser.json());

app.use(function(err, req, res, next){
  res.status(422).send({error: err.message});
});

// init routes
app.use('/users', require('./routes/users'));
app.use('/posts', require('./routes/posts'));

app.listen(process.env.port || 8000, function(){
  console.log('server started');
});