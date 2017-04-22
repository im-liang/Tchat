var express = require('express');
var Item = require('../models/item');
var User = require('../models/user');
var mongoose = require('mongoose');

const DEFAULT_ITEM_PAGESIZE = 25;
const MAX_ITEM_PAGESIZE = 100;

module.exports = {
	post_search: function(req, res){
		var pagesize = Number(req.body.limit);
		var timestamp = req.body.timestamp;
		if(isNaN(pagesize) || pagesize <= 0)
			pagesize = DEFAULT_ITEM_PAGESIZE;
		else if(pagesize > MAX_ITEM_PAGESIZE)
			pagesize = MAX_ITEM_PAGESIZE;
		if(timestamp === undefined)
			timestamp = parseInt((Date.now() / 1000).toFixed(0));
		else timestamp = parseInt(timestamp);

		var username = req.body.username;
		var following = req.body.following;
		if(following === undefined)
			following = true;
		var q = req.body.q;

		var rank = req.body.rank;
		if(rank === undefined)
			rank = 'interest';
		var parent = req.body.parent;
		if(parent === undefined)
			parent = 'none';
		var replies = req.body.replies;
		if(replies === undefined)
			replies = true;

		if(username) {
			if(following) {
				User.findOne({
						username: req.session.username,
						following: username
				}).lean().exec(function(err, found) {
					if(err) {
						res.send({
								status: 'error',
								error: err
						});
					}
					if(found) {
						let query = [];
						query['$and']=[];
						query['$and'].push({username:username});

						query['$and'].push({timestamp:{$lte : timestamp}});
						if(q) {
							query['$and'].push({content: {$regex: q}});
						}
						if(parent !== 'none') {
							query['$and'].push({parent: parent});
						}
						if(replies) {
							query['$and'].push({content: {$not: /^RT.*/}});
						}
						if(rank === 'interest') {
							query['$and'].push({ $sortByCount: {like} });
							query['$and'].push({ $sortByCount: {retweet} });
						}else {
							query['$and'].push({ $sort: {timestamp: 'desc'} });
						}
						Item.find(query)
								.limit(pagesize)
								.exec(function(err, result){
									if(err){
										console.log(err);
										res.send({status: 'error', error: err});
									}
									else if(!result){
										console.log('No tweets is found.');
										res.send({status: 'error', error: 'No tweets is found.'});
									}
									else{
										res.send({status: 'OK', items: result});
									}
								});
					}else {
						res.send({status: 'OK', items: []});
					}
				});
			}
		}else {
			if(following) {
				User.findOne({
						username: req.session.username,
				}).lean().exec(function(err, found) {
					let query = {};
					query['$and']=[];
					query['$and'].push({username: {$in: found.following}});

					query['$and'].push({timestamp:{$lte : timestamp}});
					if(q) {
						query['$and'].push({content: {$regex: q}});
					}
					if(parent !== 'none') {
						query['$and'].push({parent: parent});
					}
					if(replies) {
						query['$and'].push({content: {$not: /^RT.*/}});
					}
					if(rank === 'interest') {
						query['$and'].push({ $sortByCount: {like} });
						query['$and'].push({ $sortByCount: {retweet} });
					}else {
						query['$and'].push({ $sort: {timestamp: 'desc'} });
					}
					Item.find(query)
							.limit(pagesize)
							.exec(function(err, result){
								if(err){
									console.log(err);
									res.send({status: 'error', error: err});
								}
								else if(!result){
									console.log('No tweets is found.');
									res.send({status: 'error', error: 'No tweets is found.'});
								}
								else{
									res.send({status: 'OK', items: result});
								}
							});
				});
			}else {
				let query = {};
				query['$and']=[];
				query['$and'].push({timestamp:{$lte : timestamp}});
				if(q) {
					query['$and'].push({content: {$regex: q}});
				}
				if(parent !== 'none') {
					query['$and'].push({parent: parent});
				}
				if(replies) {
					query['$and'].push({content: {$not: /^RT.*/}});
				}
				if(rank === 'interest') {
					query['$and'].push({ $sortByCount: {like} });
					query['$and'].push({ $sortByCount: {retweet} });
				}else {
					query['$and'].push({ $sort: {timestamp: 'desc'} });
				}
				Item.find(query)
						.limit(pagesize)
						.exec(function(err, result){
							if(err){
								console.log(err);
								res.send({status: 'error', error: err});
							}
							else if(!result){
								console.log('No tweets is found.');
								res.send({status: 'error', error: 'No tweets is found.'});
							}
							else{
								res.send({status: 'OK', items: result});
							}
						});
			}
		}
	}
};
