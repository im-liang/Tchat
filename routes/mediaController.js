var express = require('express');
var Item = require('../models/item');
var User = require('../models/user');
var Media = require('../models/media');
var mongoose = require('mongoose');

module.exports = {
	post_addmedia: function(req, res){
		var content = req.body.content;
		var media = new Media();
		media.content = req.body.content;

		media.save(function(err, result){
			if (err) {
					res.send({
							status: 'error',
							error: err
					});
			}
			res.send({status: 'OK', id: result.id});
		});
	},
	get_media: function(req, res){
		Media.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
				.exec(function(err, found){
					if(err){
						console.log(err);
						res.send({status: 'error', error: err});
					}
					else if(!found){
						console.log('No media is found.');
						res.send({status: 'error', error: 'No media is found.'});
					}
					else{
						res.send({status: 'OK', item: found});
					}
				});
	},
};
