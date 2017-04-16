// require our dependencies
var express        = require('express');
var expressLayouts = require('express-ejs-layouts');
const session	   = require('express-session');
const MongoStore   = require('connect-mongo')(session);
var mongodb = require('mongodb');
var bodyParser     = require('body-parser');
var app            = express();
var mongoose       = require('mongoose');
var http = require('http');
var port           = process.env.PORT || 3000;

// use ejs and express layouts
app.set('view engine', 'ejs');
app.use(expressLayouts);

// use body parser, and session for user cookies after login
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session( { secret: 'team ysjl',
		   cookie: { maxAge: null },
		   store: new MongoStore({ mongooseConnection: mongoose.connection }),
		   saveUninitialized: false,
		   resave: false }
		));

// route our app
var router = require('./routes/routes');
app.use('/', router);

// database
var url = 'mongodb://localhost/Robingoods';
MongoClient.connect(url, function(err, db) {
	if (err) {
		console.error('MongodbClient connection ' + url + ' failed');
		process.exit(1);
	} else {
  	console.log("Connected correctly to server.");
	}
});

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
