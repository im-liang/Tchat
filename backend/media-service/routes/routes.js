const express    = require('express');
const api      = new express.Router();
const mediaController = require('./controllers/MediaController');

api.route('/addmedia').post(mediaController.addMedia);
api.route('/media/:id').get(mediaController.getMedia);

module.exports = api;
