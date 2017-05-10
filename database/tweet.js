var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

// These variables are local to this module
var tweetDB;
var tweetCollection;
var context;
var settings;

module.exports = tweetDB = {
  // Initialize the module. Invokes callback when ready (or on error)
  init: function(contextArg, callback) {
    context = contextArg;
    settings = context.settings;

    // Open the database connection
    var dbConnection = MongoClient.connect(settings.db.url, function(err, tweetDB) {
      if (err) {
        callback(err);
      }
      tweetCollection = tweetDB.collection('tweet');
      tweetCollection.createIndex({postedBy: 1});
      tweetCollection.createIndex({content: "text"});
      tweetCollection.createIndex({timestamp: -1});
      tweetCollection.createIndex({parent:1});
      tweetCollection.createIndex({interest:1});
    });
  },
  addTweet: function(req, res) {
    var content = req.body.content;
    var parent = mongodb.ObjectId(req.body.parent);
    var media = req.body.media;
    var postedBy = mongodb.ObjectId(req.body.postedBy);
    var newTweet = {
      timestamp: new Date(),
      content,
      parent,
      media,
      postedBy,
      like: 0,
      interest: (new Date()).getTime()
    };
    tweetCollection.insertOne(newTweet, function (err, result) {
      if(err) {
        res.status(500).send({status: 'error', error: err.message});
      }else {
        res.status(200).send({status: 'OK', success: 'post created', id: result.insertedID});
      }
    });
  },
  getTweet: function(req, res) {
    var id = mongodb.ObjectId(data.id);
    tweetCollection.findOne({_id: id}, function (err, result) {
      if(!err && result !== null) {
        callback(err, result);
      }
    });
  },
  deleteTweet: function(req, res) {

  },
  searchTweet: function(req, res) {

  },
  addMedia: function(req, res) {

  },
  getMedia: function(req, res) {

  },
  like: function(req, res) {

  }
};
