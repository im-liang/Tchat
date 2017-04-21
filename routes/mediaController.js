var express = require('express');
var Item = require('../models/item');
var User = require('../models/user');
var Media = require('../models/media');
var mongoose = require('mongoose');
var cassandra = require('cassandra-driver');
var path    = require('path');

module.exports = {
	post_addmedia: function(req, res){
		var content = req.file.content;
		var id = uuid.v4();

		const query = 'INSERT INTO media.imgs(id, content) VALUES (?, ?)';
		client.execute(query, [id,content], function (err, result) {
			if(err) {
				res.send({
						status: 'error',
						error: err
				});
			} else {
				res.send({status: 'OK'});
			}
		});
	},
	get_media: function(req, res){
		var id = req.query.id;
		const query = 'SELECT content FROM media.imgs WHERE id = ?';
		client.execute(query, [id], function(err, result) {
			if(err) {
				res.send({"status":"error"});
			} else {
// 		console.log(result);
// console.log('main'+result);
// console.log('row'+result.rows[0].contents);
				res.setHeader('content-type', 'multipart/form-data');
				res.setHeader('Content-Encoding', 'identity');
				res.writeHead(200);
				res.write('/home/ubuntu/TwitterClone/image'+result.rows[0].contents);
				res.end();
		// 	fs.readFile('/usr/share/nginx/html/eliza/image/'+result.rows[0].contents, function (err, data){
		// 		if(err) {
		// 			console.log(err);
		// 		} else {
		// 		 res.write(data);
		// 		 res.end();
		// 	 }
		//  });
 			}
		});
	},
};
