var express = require('express');
var userDB = require('../database/user.js');
const uuidV1 = require('uuid/v1');

module.exports = {
    get_signup: function(req, res) {
        res.render('adduser.ejs');
    },
    get_login: function(req, res) {
        res.render('login.ejs');
    },
    post_adduser: function(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var key = uuidV1();
        userDB.addUser({username: username, email:email, password:password, key:key, status:false}, res);
    },
    post_login: function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        userDB.loginUser({username: username, password:password}, req, res);
    },
    post_logout: function(req, res) {
        req.session.destroy(function(err) {
            if (err) {
                res.send({status: 'error'});
            } else {
                res.send({status: 'OK'});
            }
        });
    },
    post_verify: function(req, res) {
        var key = req.body.key;
        var email = req.body.email;
        userDB.verifyUser({key: key, email: email}, res);
    }
}
