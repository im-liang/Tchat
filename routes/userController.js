var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var uuid = require('node-uuid');
var User = require('../models/user');

module.exports = {
    post_adduser: function(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;

        var key = uuid.v4();
        var new_user = new User({
            "username": username,
            "password": password,
            "email": email,
            "status": false,
            "verify": key
        });
        new_user.save(function(err, user) {
            if (err) {
                res.send({
                    status: 'error',
                    error: err
                });
            } else {
              res.send({
                  status: 'OK'
              });
            }
        });
    },
    get_signup: function(req, res) {
        res.render('pages/adduser.ejs');
    },
    get_login: function(req, res) {
        res.render('pages/login.ejs');
    },
    post_login: function(req, res) {
        var username = req.body.username;
        var password = req.body.password;

        User.findOne({
            username: username,
            status: true
        }, function(err, found) {
            if (err) {
                res.send({
                    status: 'error',
                    error: err
                });
            }
            if (found) {
                if (password === found.password) {
                    req.session.username = username;
                    req.session.userid = found._id;
	                  console.log('Saved session ID ' + req.session.id);
                    console.log('Saved user ID ' + req.session.userid);
                    console.log('Saved username ' + req.session.username);
		                res.send({
		                    status: 'OK',
		                });
                }
                else {
                   res.send({
                       status: 'error',
                       error: username + ' Username or password does not match.'
                   });
                 }
            } else {
              res.send({
                  status: 'error',
                  error: username + 'No such user or the user hasn\'t been verified!'
              });
            }
        });
    },
    post_logout: function(req, res) {
        req.session.destroy(function(err) {
            if (err) {
                console.log(err);
                res.send({
                    status: 'error'
                });
            } else {
                res.send({
                    status: 'OK'
                });
            }
        });
    },
    get_verify: function(req, res) {
        var key = req.query.key;
        var currentUser_email = req.query.email;
        if(key === 'abracadabra') {
            User.findOneAndUpdate({email: currentUser_email}, {$set:{status: true}}, function(err, found) {
                if(err) {
                    res.send({status: 'error', error: err});
                }
                if(found) {
                    res.send({status: 'OK'});
                }else {
                    res.send({status: 'error', error: 'No such user!'});
                }
            });
        }else {
          User.findOne({
              email: currentUser_email
          }, function(err, found) {
              if (found) {
                  if (found.verify === key) {
                      if (found.status === false) {
                          found.status = true;
                          found.save();
                          res.send({status: 'OK'});
                      } else {
                          res.send({status: 'error', error: 'This account is already verified!'});
                      }
                  }
              } else {
                  res.send({status: 'error', error: 'No such user!'});
              }
          });
        }
    },
    post_verify: function(req, res) {
        var key = req.body.key;
        var currentUser_email = req.body.email;
        if(key === 'abracadabra') {
            User.findOneAndUpdate({email: currentUser_email}, {$set:{status: true}}, function(err, found) {
                if(err) {
                    res.send({status: 'error', error: err});
                }
                if(found) {
                    res.send({status: 'OK'});
                }else {
                    res.send({status: 'error', error: 'No such user!'});
                }
            });
        }else {
          User.findOne({
              email: currentUser_email
          }, function(err, found) {
              if (found) {
                  if (found.verify === key) {
                      if (found.status === false) {
                          found.status = true;
                          found.save();
                          res.send({status: 'OK'});
                      } else {
                          res.send({status: 'error', error: 'This account is already verified!'});
                      }
                  }
              } else {
                  res.send({status: 'error', error: 'No such user!'});
              }
          });
        }
    }
}
