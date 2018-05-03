const express    = require('express');
const bodyParser   = require('body-parser');
const jsonParser = bodyParser.json();

const api        = new express.Router();
const userController   = require('./controllers/UserController');

api.route('/adduser').post(jsonParser, userController.addUser);
api.route('/login').post(jsonParser, userController.login);
api.route('/logout').post(jsonParser, userController.logout);
api.route('/verify').post(jsonParser, userController.verify);
api.route('/user/:username').get(jsonParser, userController.getUser);

module.exports = api;
