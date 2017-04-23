// require our dependencies
var express        = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser     = require('body-parser');
var app            = express();
var http = require('http');
var port           = process.env.PORT || 3000;
var MongoClient = require('mongodb').MongoClient;

// use ejs and express layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);

// use body parser, and session for user cookies after login
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// route our app
var router = require('./routes/routes');
app.use('/', router);

// set static files (css and images, etc) location
app.use(express.static(__dirname + '/public'));

// start the server
const server0 = app.listen(port, function() {
  console.log('App started on port ' + port + '...');
});
server0.timeout = 240000;

const server1 = app.listen(3001, function() {
  console.log('App started on port 3001 ...');
});
server1.timeout = 240000;

const server2 = app.listen(3002, function() {
  console.log('App started on port 3002 ...');
});
server2.timeout = 240000;
