const express          = require('express');
const api              = new express.Router();
const userController   = require('./controllers/UserController');
const bodyParser       = require('body-parser');
const jsonParser       = bodyParser.json();
const urlParser        = bodyParser.urlencoded({extended: false, limit: '10kb'});

api.route('/adduser').post(jsonParser, userController.addUser);
api.route('/login').post(jsonParser, userController.login);
api.route('/logout').post(jsonParser, userController.logout);
api.route('/confirm').get(urlParser, userController.confirm);
api.route('/verify').post(jsonParser, userController.verify);
api.route('/user/:username').get(urlParser, userController.getUser);

module.exports = api;
