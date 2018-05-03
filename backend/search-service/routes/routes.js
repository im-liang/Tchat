const express    = require('express');
const api      = new express.Router();
const searchController = require('./controllers/SearchController')


api.route('/search').post(searchController.search);

module.exports = api;
