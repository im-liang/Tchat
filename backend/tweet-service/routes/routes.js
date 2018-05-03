const express    = require('express');
const api      = new express.Router();
const tweetController = require('./controllers/TweetController');

api.route('/additem').post(tweetController.addItem);
api.route('/item/:id').get(tweetController.getItem);
api.route('/item/:id').delete(tweetController.deleteItem);
api.route('/item/:id/like').post(tweetController.likeItem);

module.exports = api;
