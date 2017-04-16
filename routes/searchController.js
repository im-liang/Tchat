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
		var parent = req.body.parent;
		var replies = req.body.replies;

		if(username) {
			if(following) {
				User.findOne({
						username: req.session.username,
						following: username
				}).lean().exec(function(err, found) {
					if(err) return console.log(err);
						if (found) {
							if(q) {
								Item.find({ "timestamp": {$lte : timestamp}, content: {$regex: q}, username: username})
										.limit(pagesize)
										.exec(function(error, result){
											if(error){
												console.log(error);
												res.send({status: 'error', error: error});
											}
											else if(!result){
												console.log('No tweets is found.');
												res.send({status: 'error', error: 'No tweets is found.'});
											}
											else{
												res.send({status: 'OK', items: result});
											}
										});
							} else {
								Item.find({ "timestamp": {$lte : timestamp}, username: username})
										.limit(pagesize)
										.exec(function(error, result){
											if(error){
												console.log(error);
												res.send({status: 'error', error: error});
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
						} else {
							res.send({status: 'OK', items: []});
						}
					});
			}else {
				if(q) {
					Item.find({ "timestamp": {$lte : timestamp}, content: {$regex: q}, username: username})
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
				} else {
					Item.find({ "timestamp": {$lte : timestamp}, username: username})
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
		else {
			if(following) {
				User.findOne({
						username: req.session.username,
				}).lean().exec(function(err, found) {
					if(q) {
						Item.find({ "timestamp": {$lte : timestamp}, content: {$regex: q}, username: {$in: found.following}})
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
						Item.find({ "timestamp": {$lte : timestamp}, username: {$in: found.following}})
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
				});
			}else  {
				if(q) {
					Item.find({ "timestamp": {$lte : timestamp}, content: {$regex: q}})
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
					Item.find({ "timestamp": {$lte : timestamp}})
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
	}
};