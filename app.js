var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var cors = require('cors');

mongoose.connect("mongodb://jeevan:welcome1@ds349065.mlab.com:49065/bounce",{useNewUrlParser: true});

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Connected to the DB");
});

app.use(session({
  secret: 'random value',
  resave: true,
  saveUninitialized: false,
}));


var scooter = require('./routes/scooter');
app.use('/scooter',scooter);

var images = require('./routes/image');
app.use('/images',images);


// Catch 404 and forward it to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

//error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
