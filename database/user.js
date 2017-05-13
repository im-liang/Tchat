var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var async = require("async");

// These variables are local to this module
var db;
var userCollection;
var followCollection;
var context;
var settings;

module.exports = db = {
    // Initialize the module. Invokes callback when ready (or on error)
    init: function(contextArg, callback) {
        context = contextArg;
        settings = context.settings;

        // Open the database connection
        var dbConnection = MongoClient.connect(settings.db.url, function(err, db) {
            if (err) {
                callback(err);
            }
            userCollection = db.collection('user');
            userCollection.createIndex({username: 1});

            followCollection = db.collection('follow');
            followCollection.createIndex({follower: 1});
            followCollection.createIndex({following: 1});
        });
    },
    addUser: function(data, res) {
        var username = data.username;
        var email = data.email;
        var password = data.password;
        // an example using an object instead of an array
        async.parallel({
            one: function(callback) {
              userCollection.findOne({
                  username: username
              }, function(err, result) {
                if(err) {
                  callback(err);
                }else {
                  callback(null, result);
                }
              });
            },
            two: function(callback) {
              userCollection.findOne({
                  email: email
              }, function(err, result) {
                if(err) {
                  callback(err);
                }else {
                  callback(null, result);
                }
              });
            }
        }, function(err, results) {
            // results is now equals to: {one: 1, two: 2}
            if(err) {
              res.status(400).send({status:'error', error:err});
            }else {
              if(results.one || results.two) {
                res.status(200).send({status:'error', error:'/adduser: username or email already exists'});
              }else {
                userCollection.insertOne(data).then(function(result) {
                  res.status(200).send({status:'OK'});
                });
              }
            }
        });
    },
    loginUser: function(data, req, res) {
      userCollection.findOne({
          username: data.username
      }, function(err, result) {
        if(err) {
          res.status(400).send({status:'error', error:err});
        }else {
          if(!result) {
            res.status(200).send({status:'error', error:'/login: no such user!'});
          }else {
            if(!result.status) {
              res.status(200).send({status:'error', error:'/login: user not verified yet!'});
            }
            else if(result.password !== data.password) {
              res.status(200).send({status:'error', error:'/login: password failed!'});
            }
            else {
              req.session.username = result.username;
              req.session.userid = result._id;
              res.status(200).send({status:'OK'});
            }
          }
        }
      });
    },
    verifyUser: function(data, res) {
      if (data.key === 'abracadabra') {
        userCollection.findOneAndUpdate({email: data.email}, {$set:{status: true}}, function(err, result) {
          if(err) {
            res.status(400).send({status:'error', error:err});
          }else {
            if(!result) {
              res.status(400).send({status:'error', error:'/verify: no such email'});
            }else {
              res.status(200).send({status:'OK'});
            }
          }
        });
      } else {
        userCollection.findOneAndUpdate({email: data.email, key: data.key}, {$set:{status: true}}, function(err, result) {
          if(err) {
            res.status(400).send({status:'error', error:err});
          }else {
            if(!result) {
              res.status(400).send({status:'error', error:'/verify: no such email or key'});
            }else {
              res.status(200).send({status:'OK'});
            }
          }
        });
      }
    },
    getUser: function(data, res) {
      userCollection.findOne({
          username: data.username
      }, function(err, result) {
        if(err) {
          res.status(400).send({status:'error', error:err});
        }else {
          if(!result) {
            res.status(200).send({status:'error', error:'/login: no such user!'});
          }else {
            res.status(200).send({status:'OK'});
          }
        }
      });
    },
    follow: function(data, req, res) {
      if(data.follow) {
        followCollection.insertOne({following:data.username, follower: req.session.username}, function(err, result) {
          if(err) {
            res.status(400).send({status:'error', error:err});
          }else {
            res.status(200).send({status:'OK'});
          }
        });
      }else {
        followCollection.deleteMany({following:data.username, follower: req.session.username}, function(err, result) {
          if(err) {
            res.status(400).send({status:'error', error:err});
          }else {
            res.status(200).send({status:'OK'});
          }
        });
      }
    },
    following: function(data, res) {
      followCollection.find({follower: data.username}, {following:1}, {limit: data.limit}, function(err, result) {
        if(err) {
          res.status(400).send({status:'error', error:err});
        }else {
          res.status(200).send({status:'OK', users:result.toArray()});
        }
      });
    },
    follower: function(data, res) {
      followCollection.find({following: data.username}, {follower:1}, {limit: data.limit}, function(err, result) {
        if(err) {
          res.status(400).send({status:'error', error:err});
        }else {
          res.status(200).send({status:'OK', users:result.toArray()});
        }
      });
    }
};
