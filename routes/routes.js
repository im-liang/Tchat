var express = require('express');
var userCtrl = require('./userController');
var tweetCtrl = require('./tweetController');
var followCtrl = require('./followController');

var router = express.Router();

router.get('/', function(req, res) {
//	render layout.ejs with index.ejs as `body`.
	if(req.session.username) {
		res.render('main.ejs');
	} else {
		res.render('login.ejs');
	}
});

// Routes for user
router.route('/adduser').post(userCtrl.post_adduser);
router.route('/signup').get(userCtrl.get_signup);
router.route('/login').get(userCtrl.get_login);
router.route('/login').post(userCtrl.post_login);
router.route('/logout').post(userCtrl.post_logout);
router.route('/verify').post(userCtrl.post_verify);
router.route('/user/:username').get(userCtrl.get_user);

// Routes for follow
router.route('/user/:username/followers').get(followCtrl.get_user_followers);
router.route('/user/:username/following').get(followCtrl.get_user_following);
router.route('/follow').post(followCtrl.post_follow);

// Routes for search
router.route('/search').post(tweetCtrl.post_search);

// Routes for media
router.post('/addmedia').post(tweetCtrl.post_addMedia);
router.route('/media/:id').get(tweetCtrl.get_media);

// Routes for item
router.route('/additem').post(tweetCtrl.post_additem);
router.route('/item/:id').get(tweetCtrl.get_item);
router.route('/item/:id').delete(tweetCtrl.delete_item);
router.route('/item/:id/like').post(tweetCtrl.post_likeitem);

module.exports = router;
