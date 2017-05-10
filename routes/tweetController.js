var express = require('express');

module.exports = {
	post_additem: function(req, res){
		if(!req.session.username){
			res.send({status: 'error', error: req.session.username +' is not logged in. Permission denied.'});
		}

		var item = new Item();
		item.content = req.body.content;
		item.username = req.session.username;
		item.parent = req.body.parent;
		item.timestamp = parseInt((Date.now() / 1000).toFixed(0));
		item.media = req.body.media;
		item.like = 0;
		item.retweet = 0;
	},

	get_item: function(req, res){
	},

	delete_item: function(req, res){
	},
	post_likeitem: function(req, res) {
		var like = req.body.like;
		userid = req.session.userid;
		if(like === undefined) {
			like = true;
		}
	},
  post_search: function(req, res) {

  },
  get_media: function(req, res) {

  },
  post_addMedia: function(req, res) {
    
  }
};
