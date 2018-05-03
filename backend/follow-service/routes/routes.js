const express    = require('express');
const api      = new express.Router();
const followController   = require('./controllers/FollowController');

api.route('/user/:username/followers').get(followController.getFollowers);
api.route('/user/:username/following').get(followController.getFollowing);
api.route('/follow').post(followController.follow);

module.exports = api;
