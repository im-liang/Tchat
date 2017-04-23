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
						let query = {};
						if(q && !replies) {
							query = {$and : [{content:{$regex: q}}, {content: {$not: /^RT.*/}}]};
						}else if(q) {
							query[content] = {$regex: q};
						}else if(!replies) {
							query[content] = {$not: /^RT.*/};
						}
						query[username] = username;
						query[timestamp] = {$lte : timestamp};
						if(parent !== 'none') {
							query[parent] = parent;
						}
						if(rank === 'interest') {
							Item.find(query)
									.sort({like: -1, retweet: -1})
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
											console.log(query);
											console.log(result);
											res.send({status: 'OK', items: result});
										}
									});
						}else {
							Item.find(query)
									.sort({timestamp: -1})
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
											console.log(query);
											console.log(result);
											res.send({status: 'OK', items: result});
										}
									});
						}
					}else {
						res.send({status: 'OK', items: []});
					}
				});
			}else {
				let query = {};
				if(q && !replies) {
					query = {$and : [{content:{$regex: q}}, {content: {$not: /^RT.*/}}]};
				}else if(q) {
					query[content] = {$regex: q};
				}else if(!replies) {
					query[content] = {$not: /^RT.*/};
				}
				query[username] = username;
				query[timestamp] = {$lte : timestamp};
				if(parent !== 'none') {
					query[parent] = parent;
				}
				if(rank === 'interest') {
					Item.find(query)
							.sort({like: -1, retweet: -1})
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
									console.log(query);
									console.log(result);
									res.send({status: 'OK', items: result});
								}
							});
				}else {
					Item.find(query)
							.sort({timestamp: -1})
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
									console.log(query);
									console.log(result);
									res.send({status: 'OK', items: result});
								}
							});
				}
			}
		}else {
			if(following) {
				User.findOne({
						username: req.session.username,
				}).lean().exec(function(err, found) {
					let query = {};
					if(q && !replies) {
						query = {$and : [{content:{$regex: q}}, {content: {$not: /^RT.*/}}]};
					}else if(q) {
						query[content] = {$regex: q};
					}else if(!replies) {
						query[content] = {$not: /^RT.*/};
					}
					query[username] = {$in: found.following};
					query[timestamp] = {$lte : timestamp};
					if(parent !== 'none') {
						query[parent] = parent;
					}
					if(rank === 'interest') {
						Item.find(query)
								.sort({like: -1, retweet: -1})
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
										console.log(query);
										console.log(result);
										res.send({status: 'OK', items: result});
									}
								});
					}else {
						Item.find(query)
								.sort({timestamp: -1})
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
										console.log(query);
										console.log(result);
										res.send({status: 'OK', items: result});
									}
								});
					}
				});
			}else {
				let query = {};
				if(q && !replies) {
					query = {$and : [{content:{$regex: q}}, {content: {$not: /^RT.*/}}]};
				}else if(q) {
					query[content] = {$regex: q};
				}else if(!replies) {
					query[content] = {$not: /^RT.*/};
				}
				query[timestamp] = {$lte : timestamp};
				if(parent !== 'none') {
					query[parent] = parent;
				}
				if(rank === 'interest') {
					Item.find(query)
							.sort({like: -1, retweet: -1})
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
									console.log(query);
									console.log(result);
									res.send({status: 'OK', items: result});
								}
							});
				}else {
					Item.find(query)
							.sort({timestamp: -1})
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
									console.log(query);
									console.log(result);
									res.send({status: 'OK', items: result});
								}
							});
				}
			}
		}
	}
};
