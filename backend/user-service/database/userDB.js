const MongoPool = require("./mongoPool");

function addUser (username, email, password) {

  let findUserByUsernamePromise = new Promise(function(resolve, reject) {
    MongoPool.getInstance(function (db){
      db.db('tchat').collection('user').findOne({username: username}, function (err, result) {
        if(err) return reject(new Error('database error'));
        if (result === null) resolve();
        else reject(new Error('username existed'));
      })
    });
  });

  let findUserByEmailPromise = new Promise(function (resolve, reject) {
    MongoPool.getInstance(function (db){
      db.db('tchat').collection('user').findOne({email: email}, function (err, result) {
        if(err) return reject(new Error('database error'));
        if (result === null) resolve();
        else reject(new Error('username existed'));
      })
    });
  });

  let addUserPromise = new Promise(function (resolve, reject) {
    MongoPool.getInstance(function (db){
      db.db('tchat').collection('user').insertOne({username: username, email: email, password: password}, function (err, result) {
        if (result) {
          resolve();
        }else {
          reject(new Error('database error'));
        }
      });
    });
  })

  return Promise.all([findUserByUsernamePromise, findUserByEmailPromise]).then(addUserPromise);
};

module.exports = {
  addUser
}
