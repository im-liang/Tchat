var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

var Media_Schema = new mongoose.Schema({
  content: { type: Buffer},
  uid: {type:String, index: true}
});

module.exports = mongoose.model('Media', Media_Schema);
