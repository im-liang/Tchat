var express = require('express');

const DEFAULT_ITEM_PAGESIZE = 50;
const MAX_ITEM_PAGESIZE = 200;

module.exports = {
  get_user_followers: function(req, res) {
    var username = req.params.username;
    var pagesize = Number(req.body.limit);
    if(isNaN(pagesize) || pagesize <= 0)
      pagesize = DEFAULT_ITEM_PAGESIZE;
    else if(pagesize > MAX_ITEM_PAGESIZE)
      pagesize = MAX_ITEM_PAGESIZE;
    var followers = [];

  },
  get_user_following: function(req, res) {
    var username = req.params.username;
    var pagesize = Number(req.body.limit);
    if(isNaN(pagesize) || pagesize <= 0)
      pagesize = DEFAULT_ITEM_PAGESIZE;
    else if(pagesize > MAX_ITEM_PAGESIZE)
      pagesize = MAX_ITEM_PAGESIZE;
  },
  post_follow: function(req, res) {
    var username = req.body.username;
    var follow = req.body.follow;
    if(follow === undefined)
      follow = true;

  }
}
