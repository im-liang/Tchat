var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var User = require('../models/user');

const DEFAULT_ITEM_PAGESIZE = 50;
const MAX_ITEM_PAGESIZE = 200;

module.exports = {
  get_user: function(req, res) {
      var currentUser_username = req.params.username;

      User.find({following: currentUser_username}).lean().count(function(err, count){
        User.findOne({
            username: currentUser_username
        }).lean().exec(function(err, found) {
            if (found) {
                res.send({
                    status: 'OK',
                    user:{
                      email: found.email,
                      following: found.following.length,
                      followers: count
                    }
                });
            } else {
                res.send({
                    status: 'error',
                    error: 'No such user!'
                });
            }
        });
      });
  },
  get_user_followers: function(req, res) {
    var username = req.params.username;
    var pagesize = Number(req.body.limit);
    if(isNaN(pagesize) || pagesize <= 0)
      pagesize = DEFAULT_ITEM_PAGESIZE;
    else if(pagesize > MAX_ITEM_PAGESIZE)
      pagesize = MAX_ITEM_PAGESIZE;
    var followers = [];

    User.find({following: username}).limit(pagesize).lean().exec(function(err, users) {
      var userMap = [];
      users.forEach(function(user) {
        userMap.push(user.username);
      });
      res.send({
        status: 'OK',
        users: userMap
      });
    });
  },
  get_user_following: function(req, res) {
    var username = req.params.username;
    var pagesize = Number(req.body.limit);
    if(isNaN(pagesize) || pagesize <= 0)
      pagesize = DEFAULT_ITEM_PAGESIZE;
    else if(pagesize > MAX_ITEM_PAGESIZE)
      pagesize = MAX_ITEM_PAGESIZE;

    User.findOne({
        username: username
    }).lean().exec(function(err, found) {
        if (found) {
          var following = [];
          if(pagesize > found.following.length) {
            following = found.following.slice(0, found.following.length);
          }else {
            following = found.following.slice(0, pagesize);
          }
          res.send({
            status: 'OK',
            users: following,
          });
        } else {
          res.send({
            status: 'error',
            error: 'No such user!'
          });
        }
      });
  },
  post_follow: function(req, res) {
    var username = req.body.username;
    var follow = req.body.follow;
    if(follow === undefined)
      follow = true;

    if(follow) {
      User.findOneAndUpdate({username: req.session.username}, {$push: {following: username}}, {new: true}, function(err, found){
        if(err) return console.log(err);
        res.send({status: 'OK'});
      });
    }else {
      User.findOneAndUpdate({username: req.session.username}, {$pull: {following: username}}, {new: true}, function(err, found){
        if(err) return console.log(err);
        res.send({status: 'OK'});
      });
    }
  }
}
