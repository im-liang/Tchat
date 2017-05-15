var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Memcached = require('memcached');

// These variables are local to this module
var tweetDB;
var tweetCollection;
var fileCollection;
var followCollection;
var context;
var settings;
var bucket;

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

      followCollection = tweetDB.collection('follow');

      fileCollection = tweetDB.collection('file');
      bucket = new mongodb.GridFSBucket(tweetDB, { bucketName: 'fileBucket' });
    });
  },
  getBucket: function() {
    return bucket;
  },
  addTweet: function(data, res) {
    tweetCollection.insertOne(data.newTweet, function (err, result) {
      if(err) {
        res.status(500).send({status: 'error', error: err});
      }else {
        res.status(200).send({status: 'OK', id: data.newTweet._id});
      }
    });
  },
  getTweet: function(data, res) {
    var id = mongodb.ObjectId(data.id);
    tweetCollection.findOne({_id: id}, function (err, result) {
      if(err) {
        res.status(400).send({status: 'error', error: err});
      }else {
        res.status(200).send({status: 'OK', item: result});
      }
    });
  },
  deleteTweet: function(data, res) {
    var id = mongodb.ObjectId(data.id);
    tweetCollection.findOne({_id: id}, function (err, result) {
      if(err) {
        res.status(400).send({status: 'error', error: err});
      }else {
        if(result.media) {
          result.media.forEach(function(file) {
            bucket.delete(mongodb.ObjectID(file));
          });
        }
        tweetCollection.deleteMany({_id: id}, function(error, found) {
          if(error) {
            res.status(400).send({status: 'error', error: error});
          }else {
            res.status(200).send({status: 'OK'});
          }
        });
      }
    });
  },
  searchTweet: function(data, req, res) {
    let query = {};
    if(data.q && !data.replies) {
      query = {$and : [{content:{$regex: data.q}}, {content: {$not: /^RT.*/}}]};
    }else if(data.q) {
      query['content'] = {$regex: data.q};
    }else if(!data.replies) {
      query['content'] = {$not: /^RT.*/};
    }
    query['timestamp'] = {$lte : data.timestamp};
    if(data.parent !== 'none') {
      query['parent'] = data.parent;
    }
    if(data.following == true && data.username != '') {
      followCollection.findOne({follower: req.session.username, following: data.username}, function(err, result) {
        if(err) {
          res.status(400).send({status:'error', error:err});
        }
        if(result) {
          query['postedBy'] = data.username;
          let cursor = tweetCollection.find(query);

        if(data.rank === 'interest') {
          cursor = cursor.sort({like:-1});
        }else {
          cursor = cursor.sort({timestamp:-1});
        }
        cursor.limit(data.limit).toArray(function (err, array) {
            if(err) {
                res.status(400).send({status:'error', error:err});
            }else{
                res.status(200).send({status:'OK', items:array});
            }
        });
        }else {
          res.status(200).send({status:'OK', items:[]});
        }
      });
    } else if (data.following == false && data.username !== '') {
      query['postedBy'] = data.username;
      let cursor = tweetCollection.find(query);

      if(data.rank === 'interest') {
        cursor = cursor.sort({like:-1});
      }else {
        cursor = cursor.sort({timestamp:-1});
      }
      cursor.limit(data.limit).toArray(function (err, array) {
        if(err) {
            res.status(400).send({status:'error', error:err});
        }else{
            res.status(200).send({status:'OK', items:array});
        }
      });
    } else if (data.following == true && data.username == '') {
      followCollection.distinct("following", {follower: req.session.username}, function(err, result) {
          if(err) {
            res.status(400).send({status:'error', error:err});
          }else {
            query['postedBy'] = {$in: result};
            let cursor = tweetCollection.find(query);
            if(data.rank === 'interest') {
              cursor = cursor.sort({like:-1});
            }else {
              cursor = cursor.sort({timestamp:-1});
            }
            cursor.limit(data.limit).toArray(function (err, array) {
              if(err) {
                  res.status(400).send({status:'error', error:err});
              }else{
                  res.status(200).send({status:'OK', items:array});
              }
            });
          }
      });
    }else {
      let cursor = tweetCollection.find(query);

      if(data.rank === 'interest') {
        cursor = cursor.sort({like:-1});
      }else {
        cursor = cursor.sort({timestamp:-1});
      }
      cursor.limit(data.limit).toArray(function (err, array) {
        if(err) {
            res.status(400).send({status:'error', error:err});
        }else{
            res.status(200).send({status:'OK', items:array});
        }
      });
    }
  },
  getMedia: function(data, res) {
    var cursor = bucket.find({_id:mongodb.ObjectID(data.id)}, {}).limit(1);
    cursor.next(function (err, doc) {
        if(err) {
          res.status(400).send({status:'error', error:err});
        }
        if(doc == null) {
          res.status(400).send({status:'error', error:'file not found'});
        }

        var outStream = bucket.openDownloadStream(doc._id);
        // res.setHeader('Content-disposition', 'attachment; filename=' + doc.filename);
        res.setHeader('Content-length', doc.length.toString());
        res.setHeader('Content-Type', 'image/png');
        outStream.pipe(res);
        cursor.close();
    });
  },
  like: function(data, res) {
    tweetCollection.findOneAndUpdate({_id: data.id}, {$inc: {like:data.like}}, function(err, result) {
      if(err) {
        res.status(400).send({status: 'error', error: err});
      }else {
        res.status(200).send({status: 'OK'});
      }
    });
  }
};
