var express = require('express');
var userCtrl = require('./userController');
var itemCtrl = require('./itemController');
var followCtrl = require('./followController');
var searchCtrl = require('./searchController');
var mediaCtrl = require('./mediaController');
var cassandra = require('cassandra-driver');
var path    = require('path');
var multer  = require('multer');
var uuid = require('node-uuid');

var router = express.Router();

var client = new cassandra.Client({contactPoints: ['127.0.0.1']});
client.connect(function(err) {
	var query;
	query = "CREATE KEYSPACE IF NOT EXISTS media WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }";
	return client.execute(query, function(e, res) {
		if(e) {
			console.log(e);
		}
	});
});

const query = 'CREATE TABLE IF NOT EXISTS media.imgs(id uuid PRIMARY KEY, content blob)';
client.execute(query, function(e,res) {
	if(e) {
		console.log(e);
	}
});

router.get('/', function(req, res) {
//	render layout.ejs with index.ejs as `body`.
	var sess = req.session;
	if(sess.username === undefined) {
		res.render('pages/login.ejs');
	} else {
		res.render('pages/main.ejs');
	}
});

// Routes for user
router.route('/adduser').post(userCtrl.post_adduser);
router.route('/signup').get(userCtrl.get_signup);
router.route('/login').get(userCtrl.get_login);
router.route('/login').post(userCtrl.post_login);
router.route('/logout').post(userCtrl.post_logout);
router.route('/verify').get(userCtrl.get_verify);
router.route('/verify').post(userCtrl.post_verify);

// Routes for follow
router.route('/user/:username').get(followCtrl.get_user);
router.route('/user/:username/followers').get(followCtrl.get_user_followers);
router.route('/user/:username/following').get(followCtrl.get_user_following);
router.route('/follow').post(followCtrl.post_follow);

// Routes for search
router.route('/search').post(searchCtrl.post_search);

// Routes for media
var upload = multer({ dest: './image/' });
router.post('/addmedia', upload.single('content'), function(req, res) {
  var id = uuid.v4();
  var content = req.file.filename;

  const query = 'INSERT INTO media.imgs(id, content) VALUES (?, ?)';
  client.execute(query, [id,content], function (err, result) {
    if(err) {
      res.send({status: 'error', error: err});
    } else {
      res.send({status:"OK", id: id});
    }
  });
});
router.route('/media/:id').get(mediaCtrl.get_media);

// Routes for item
router.route('/additem').post(itemCtrl.post_additem);
router.route('/item/:id').get(itemCtrl.get_item);
router.route('/item/:id').delete(itemCtrl.delete_item);
router.route('/item/:id/like').post(itemCtrl.post_likeitem);

module.exports = router;
