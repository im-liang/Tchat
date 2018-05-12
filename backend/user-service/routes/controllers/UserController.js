const redis = require('redis');
const client = redis.createClient();
const uuidv1 = require('uuid/v1');
const request = require('request');
const userDB = require('../../database/userDB');
const config = require('../../config/config');
const settings = require("../../config/config.json");

function addUser(req, res) {
    userDB.addUser(req.body.username, req.body.email, req.body.password).then(value => {
        config.sendEmail(value.email, value.emailToken);
        return res.status(200).send({
            status: 'OK',
            success: 'account created'
        });
    }, reason => {
        return res.status(200).send({
            status: 'error',
            error: reason
        });
    });
}

function login(req, res) {
    userDB.findUser(req.body.username).then(value => {
        let encryptUsername = config.encryptString(value.username);
        client.hmset([encryptUsername, "username", value.username, "email", value.email], function(err, result) {
            if (err) {
                return res.status(200).send({
                    status: 'error',
                    error: 'session not created'
                });
            }
            let todayEnd = new Date().setHours(23, 59, 59, 999);
            client.expire(encryptUsername, parseInt(todayEnd / 1000));
            res.cookie('user_session', encryptUsername, {
                expires: new Date(Date.now() + 9999999),
                httpOnly: false
            });
            return res.status(200).send({
                status: 'OK',
                success: 'loged in'
            });
        });
    }, reason => {
        return res.status(200).send({
            status: 'error',
            error: reason
        });
    });
}

function logout(req, res) {
    client.get(req.cookies['user_session'], function(err, reply) {
        client.del(req.cookies['user_session'], function(err, response) {
            if (err) {
                return res.status(200).send({
                    status: 'error',
                    error: err
                });
            }
            res.clearCookie("user_session");
            return res.status(200).json("OK");
        })
    });
}

function confirm(req, res) {
    request.post(
        'http://localhost:3000/verify', {
            json: {
                email: req.params.email,
                key: req.params.key
            }
        },
        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                return res.status(200).json("OK");
            } else {
                return res.status(200).send({
                    status: 'error',
                    error: error
                });
            }
        }
    );
}

function verify(req, res) {
    return res.status(200).json("OK");
}

function getUser(req, res) {
    userDB.findUser(req.body.username).then(value => {
        let encryptUsername = config.encryptString(value.username);
        client.hmset([encryptUsername, "username", value.username, "email", value.email], function(err, result) {
            if (err) {
                return res.status(200).send({
                    status: 'error',
                    error: 'session not created'
                });
            }
            let todayEnd = new Date().setHours(23, 59, 59, 999);
            client.expire(encryptUsername, parseInt(todayEnd / 1000));
            res.cookie('user_session', encryptUsername, {
                expires: new Date(Date.now() + 9999999),
                httpOnly: false
            });
            return res.status(200).send({
                status: 'OK',
                success: 'loged in'
            });
        });
    }, reason => {
        return res.status(200).send({
            status: 'error',
            error: reason
        });
    });
}

module.exports = {
    addUser,
    login,
    logout,
    confirm,
    verify,
    getUser
};