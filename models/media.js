var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var Media_Schema = new mongoose.Schema({
  content: { type: Buffer},
  uid: String
});

module.exports = mongoose.model('Media', Media_Schema);
