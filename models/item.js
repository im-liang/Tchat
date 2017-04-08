var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var ObjectId = Schema.Types.ObjectId;
var User = require('./user');

var ItemSchema = new Schema({
	username: { type: String, ref: 'User' },
	content: String,
	timestamp: {type:Number, index: true}
	// id: String
});

ItemSchema.set('toJSON', {getter: true, virtuals: true});

module.exports = mongoose.model('Item', ItemSchema);
