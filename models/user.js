var mongoose = require("mongoose");

var User_Schema = new mongoose.Schema({
  username: {type: String, index: {unique: true, dropDups: true}},
	password: {type:String},
	email: {type: String, index: {unique: true, dropDups: true}},
  status: {type: Boolean},
  verify: String,
  following: [{ type: String, ref: 'User' }]
});

module.exports = mongoose.model('User', User_Schema);
