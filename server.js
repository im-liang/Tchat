var express        = require('express');
var bodyParser     = require('body-parser');
var CookieParser = require('cookie-parser');
var session = require('express-session');

var context = {};
context.settings = require('./settings');

var app = express();

var userDB = require('./database/user.js');
userDB.init(context);
var tweetDB = require('./database/tweet.js');
tweetDB.init(context, ready);

app.use(session( { secret: 'team ysjl',
		   cookie: { maxAge: null },
		   saveUninitialized: false,
		   resave: false }
		));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(CookieParser());

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

// route our app
var router = require('./routes/routes');
app.use('/', router);

app.all('*', function(req, res) {
  res.status(404).send('404 Not Found');
});


app.listen(context.settings.http.port, function() {
  console.log('App started on port ' + context.settings.http.port + '...');
});

function ready(err) {
  if (err) {
    throw err;
  }
}
