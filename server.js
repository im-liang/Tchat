var express        = require('express');
var bodyParser     = require('body-parser');
var CookieParser = require('cookie-parser');
var session = require('express-session');

const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('new worker');
    cluster.fork();
  });
} else {
	var context = {};
	context.settings = require('./settings');

	var app = express();

	var userDB = require('./database/user.js');
	userDB.init(context);
	var tweetDB = require('./database/tweet.js');
	tweetDB.init(context, ready);

	app.use(CookieParser());

  app.use(session( { secret: 'team ysjl',
			   cookie: { secure: false, maxAge: null },
			   saveUninitialized: false,
			   resave: false }
			));

	app.use(bodyParser.json({limit: '50mb'}));
	app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

	app.use(express.static(__dirname + '/public'));
	app.set('view engine', 'ejs');

	// route our app
	var router = require('./routes/routes');
	app.use('/', router);

	app.all('*', function(req, res) {
	  res.status(404).send('404 Not Found');
	});


	app.listen(context.settings.http.port, function() {
		console.log(`Worker ${process.pid} started`);
	  console.log('app started on port ' + context.settings.http.port + '...');
	});

	function ready(err) {
	  if (err) {
	    throw err;
	  }
	}
}
