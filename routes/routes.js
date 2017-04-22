var express = require('express');
var Media = require('../models/media');
var userCtrl = require('./userController');
var itemCtrl = require('./itemController');
var followCtrl = require('./followController');
var searchCtrl = require('./searchController');
var mediaCtrl = require('./mediaController');
var path    = require('path');
var multer  = require('multer');

var router = express.Router();

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
	// console.error('add media');

	var media = new Media();
  media.content = req.file.filename;
	media.save(function(err, result){
		if (err) {
				res.send({
						status: 'error',
						error: err
				});
		}
		res.send({status: 'OK', id: result.id});
	});

});
router.route('/media/:id').get(mediaCtrl.get_media);

// Routes for item
router.route('/additem').post(itemCtrl.post_additem);
router.route('/item/:id').get(itemCtrl.get_item);
router.route('/item/:id').delete(itemCtrl.delete_item);
router.route('/item/:id/like').post(itemCtrl.post_likeitem);

module.exports = router;
