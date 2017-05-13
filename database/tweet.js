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
  addTweet: function(data, res) {
    tweetCollection.insertOne(data.newTweet, function (err, result) {
      if(err) {
        res.status(500).send({status: 'error', error: err});
      }else {
        res.status(200).send({status: 'OK', id: result._id});
      }
    });
  },
  getTweet: function(data, res) {
    var id = mongodb.ObjectId(data.id);
    tweetCollection.findOne({_id: id}, function (err, result) {
      if(err) {
        res.status(500).send({status: 'error', error: err});
      }else {
        res.status(200).send({status: 'OK', item: result});
      }
    });
  },
  deleteTweet: function(data, res) {

  },
  searchTweet: function(data, res) {

  },
  addMedia: function(data, res) {

  },
  getMedia: function(data, res) {

  },
  like: function(data, res) {

  }
};
