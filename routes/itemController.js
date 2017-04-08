var express = require('express');
var Item = require('../models/item');
var mongoose = require('mongoose');

module.exports = {
	post_additem: function(req, res){
		if(!req.session.username){
			res.send({status: 'error', error: req.session.username +' is not logged in. Permission denied.'});
		}

		var item = new Item();
		item.content = req.body.content;
		item.username = req.session.username;
		item.timestamp = parseInt((Date.now() / 1000).toFixed(0));

		item.save(function(err, result){
			if (err) {
					res.send({
							status: 'error',
							error: err
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
				    console.log('No entry is found.');
				    res.send({status: 'error', error: 'No entry is found.'});
			    }
			    else{
				    res.send({status: 'OK', item: found});
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
			    console.log('No entry is found.');
			    res.send({status: 'error', error: 'No entry is found.'});
			}
		    else{
			    res.send({status: 'OK', item: found});
			}
  		});
	},
	post_likeitem: function(req, res) {
		
	}
};
