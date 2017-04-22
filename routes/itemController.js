var express = require('express');
var User = require('../models/user');
var Item = require('../models/item');
var mongoose = require('mongoose');
var cassandra = require('cassandra-driver');
var path    = require('path');

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

		item.save(function(err, result){
			if (err) {
					res.send({
							status: 'error',
							error: err
					});
			}
			if(req.body.parent !== undefined) {
				User.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.parent)}, {$push:{retweet: result.id}}, function (error, found) {
					if(error) {
						res.send({
								status: 'error',
								error: error
						});
					}
				});
			}
			res.send({status: 'OK', id: result.id});
		});
	},

	get_item: function(req, res){
		Item.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
		    .exec(function(err, found){
			    if(err){
				    console.log(err);
				    res.send({status: 'error', error: err});
			    }
			    else if(!found){
				    console.log('No entry is found for getting tweet.');
				    res.send({status: 'error', error: 'No entry is found for getting tweet.'});
			    }
			    else{
				    res.send({status: 'OK', item: found, media: found.media});
			    }
		    });
	},

	delete_item: function(req, res){
		Item.findOneAndRemove({_id: mongoose.Types.ObjectId(req.params.id)}, function (err,found){
		  if(err){
			    console.log(err);
			    res.send({status: 'error', error: err});
			}
		  else if(!found){
			    console.log('No entry is found for deleting item.');
			    res.send({status: 'error', error: 'No entry is found for deleting item.'});
			}
		  else{
					if(found.media.length !== 0) {
						for (var media in found.media) {
							const query = 'DELETE FROM media.imgs(id, content) WHERE id = ?';
						  client.execute(query, [media], function (err, result) {
						    if(err) {
						      res.send({status: 'error', error: err});
						    }
						  });
						}
					}
					if(found.parent) {
						User.findOneAndUpdate({_id: mongoose.Types.ObjectId(found.parent)}, {$pull:{retweet: found.id}}, function (error, found) {
							if(error) {
								res.send({
										status: 'error',
										error: error
								});
							}
						});
					}
			    res.send({status: 'OK', item: found});
			}
  		});
	},
	post_likeitem: function(req, res) {
		var like = req.body.like;
		userid = req.session.userid;
		if(like === undefined) {
			like = true;
		}
		if(like) {
			Item.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.params.id)}, {$push:{like: userid}}, function (err, found) {
				if(err){
					console.log(err);
					res.send({status: 'error', error: err});
				}
				else if(!found){
					console.log('No tweet is found for like.');
					res.send({status: 'error', error: 'No tweet is found for like.'});
				}
				else{
					res.send({status: 'OK'});
				}
			});
		}else {
			Item.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.params.id)}, {$pull:{like: userid}}, function (err, found) {
				if(err){
					console.log(err);
					res.send({status: 'error', error: err});
				}
				else if(!found){
					console.log('No entry is found for unlike.');
					res.send({status: 'error', error: 'No entry is found for unlike.'});
				}
				else{
					res.send({status: 'OK'});
				}
			});
		}
	}
};
