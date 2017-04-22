var express = require('express');
var Item = require('../models/item');
var User = require('../models/user');
var Media = require('../models/media');
var mongoose = require('mongoose');
var path    = require('path');

module.exports = {
	get_media: function(req, res){
		// console.error('get media');
		Media.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
				.exec(function(err, found){
					if(err){
						console.log(err);
						res.send({status: 'error', error: err});
					}
					else if(!found){
						console.log('No entry is found for getting media.');
						res.send({status: 'error', error: 'No entry is found for getting media.'});
					}
					else{
						res.setHeader('content-type', 'multipart/form-data');
						res.writeHead(200);
						res.write('/home/ubuntu/TwitterClone/image/'+found.content);
						res.end();
					}
				});
	}
};
