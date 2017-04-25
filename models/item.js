var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./user');
var Media = require('./media');

var ItemSchema = new mongoose.Schema({
	username: {type: String},
	content: String,
	timestamp: {type:Number, index: true},
	parent: { type: ObjectId },
	media: [String],
	like: Number,
	retweet: Number
});

ItemSchema.set('toJSON', {getter: true, virtuals: true});

module.exports = mongoose.model('Item', ItemSchema);
