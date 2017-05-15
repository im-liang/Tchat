var express = require('express');
var tweetDB = require('../database/tweet.js');
var Busboy = require('busboy');
var mongodb = require('mongodb');

module.exports = {
	post_additem: function(req, res){
		if(!req.session.username){
			res.send({status: 'error', error: req.session.username +' is not logged in. Permission denied.'});
		}else {
			var content = req.body.content;
			var parent = req.body.parent;
			if(parent) {
				parent = mongodb.ObjectId(req.body.parent);
			}
			var media = req.body.media;
			var postedBy = req.session.username;
			var newTweet = {
				timestamp: parseInt((Date.now() / 1000).toFixed(0)),
				content,
				parent,
				media,
				postedBy,
				like: 0,
				interest: (new Date()).getTime()
			};

			tweetDB.addTweet({newTweet: newTweet}, res);
		}
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
		if(like === undefined || like === true || like === 'true') {
			like = 1;
		}else {
			like = -1;
		}

		tweetDB.like({id: userid, like: like}, res);
	},
  post_search: function(req, res) {
		const DEFAULT_ITEM_PAGESIZE = 25;
		const MAX_ITEM_PAGESIZE = 100;

		var timestamp = req.body.timestamp;
		var limit = req.body.limit;
		var q = req.body.q;
		var username = req.body.username;
		var following = req.body.following;
		var rank = req.body.rank;
		var parent = req.body.parent;
		var replies = req.body.replies;

		if(timestamp === undefined || timestamp === '')
			timestamp = parseInt((Date.now() / 1000).toFixed(0));
		else timestamp = parseInt(timestamp);

		if(limit === undefined || limit === '') {
			limit = DEFAULT_ITEM_PAGESIZE
		}else if (limit > MAX_ITEM_PAGESIZE) {
			limit = MAX_ITEM_PAGESIZE;
		}

		if(following === undefined || following === 'true' || following === '')
			following = true;
		if(following === 'false')
			following = false;

		if(rank === undefined || rank === '')
			rank = 'interest';

			if(replies === undefined || replies === 'true' || replies === '')
				replies = true;
			if(replies === 'false')
				replies = false;

			if(parent === undefined || parent === '')
				parent = 'none';


		tweetDB.searchTweet({timestamp, limit, q, username, following, rank, parent, replies}, req, res);
  },
  get_media: function(req, res) {
		tweetDB.getMedia({id: req.params.id}, res);
  },
  post_addMedia: function(req, res) {
		var boy = new Busboy({
			headers: req.headers,
			limits:{fields:50, fieldSize:40*1024, files:1, fileSize: 10*1024*1024, headerPairs:1}
		});
		boy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			if(filename.length == 0) {
				file.pipe(BlackHole());
				res.status(400).send({status:'error', error:'file size is 0'});
			}
			var fileID = mongodb.ObjectID();
			var uploadStream = tweetDB.getBucket().openUploadStreamWithId(fileID, filename, {metadata:{}, contentType:mimetype});
			file.on('end', function () {
				if(ended) console.error('HELL!!!');
				fields.attachmentList.push({name:filename, id:fileID});
			});
			file.on('limit', function(){
				uploadStream.abort(function () {});
				res.status(400).send({status:'error', error:'file size is too large'});
			});
			file.pipe(uploadStream).once('finish', function () {
				if(ended) return tweetDB.getBucket().delete(fileID);
				function dropFiles(){
						for(var file of fields.attachmentList){
								s.orderFileBucket.delete(file.id);
						}
						fields.attachmentList = [];
						ended = true;
				}
				console.log(fields.attachmentList[0].id);
				res.send({status:'OK', id: fields.attachmentList[0].id});
			});
		});
		boy.on('filesLimit', function() {
			res.status(400).send({status:'error', error:'too many files'});
		});
		boy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
			fields[fieldname] = val;
		});
		boy.on('fieldsLimit', function() {
			res.status(400).send({status:'error', error:'too many fields'});
		});
		req.pipe(boy);
  }
};
