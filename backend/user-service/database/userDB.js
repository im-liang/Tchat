const uuidv1 = require('uuid/v1');
const MongoPool = require("./mongoPool");
const settings = require("../config/config.json");

function checkUserNotExist(username, email) {
    return new Promise(function(resolve, reject) {
        MongoPool.getInstance(function(db) {
            db.db(settings.db.database).collection(settings.db.userCollection).findOne({
                "$or": [{
                    "username": username
                }, {
                    "email": email
                }]
            }, function(err, result) {
                if (err) {
                    reject(new Error('database error'));
                }
                if (result === null) {
                    resolve();
                } else {
                    reject(new Error('account existed'));
                }
            });
        });
    });
}

function insertUser(username, email, password) {
    return new Promise(function(resolve, reject) {
        MongoPool.getInstance(function(db) {
            db.db(settings.db.database).collection(settings.db.userCollection).insertOne({
                username: username,
                email: email,
                password: password,
                emailVerified: false,
                emailToken: uuidv1(),
                createdAt: new Date(),
                active: true
            }, function(err, result) {
                if (result) {
                    resolve(result.ops[0]);
                } else {
                    reject(new Error('database error'));
                }
            });
        });
    });
}

function addUser(username, email, password) {
    return checkUserNotExist(username, email).then(value => {
        return insertUser(username, email, password);
    }, reason => {
        return Promise.reject(reason.message);
    });
};

function findUser(account) {
    return new Promise(function(resolve, reject) {
        MongoPool.getInstance(function(db) {
            db.db(settings.db.database).collection(settings.db.userCollection).findOne({
                "$or": [{
                    "username": account
                }, {
                    "email": account
                }]
            }, function(err, result) {
                if (err) {
                    reject(new Error('database error'));
                }
                if (result === null) {
                    reject(new Error('no such user'));
                } else {
                    resolve(result);
                }
            });
        });
    });
}

module.exports = {
    addUser,
    findUser
}