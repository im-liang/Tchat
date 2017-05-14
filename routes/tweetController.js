var express = require('express');
var tweetDB = require('../database/tweet.js');

module.exports = {
	post_additem: function(req, res){
		if(!req.session.username){
			res.send({status: 'error', error: req.session.username +' is not logged in. Permission denied.'});
		}

		var content = req.body.content;
    var parent = mongodb.ObjectId(req.body.parent);
    var media = req.body.media;
    var postedBy = mongodb.ObjectId(req.session.username);
    var newTweet = {
      timestamp: new Date(),
      content,
      parent,
      media,
      postedBy,
      like: 0,
      interest: (new Date()).getTime()
    };

		tweetDB.addTweet({newTweet: newTweet}, res);
	},

	get_item: function(req, res){
		var id = req.params.id;

		tweetDB.getTweet({id: id}, res);
	},

	delete_item: function(req, res){
		var id = req.params.id;

		tweetDB.deleteTweet({id:id}, res);
	},
	post_likeitem: function(req, res) {
		var like = req.body.like;
		userid = req.session.userid;
		if(like === undefined || like === true) {
			like = 1;
		}else {
			like = -1;
		}

		tweetDB.like({id: userid, like: like}, res);
	},
  post_search: function(req, res) {
		tweetDB.searchTweet({}, res);
  },
  get_media: function(req, res) {
		tweetDB.getMedia({}, res);
  },
  post_addMedia: function(req, res) {
		tweetDB.addMedia({}, res);
  }
};
