const uuidv1 = require('uuid/v1');
const MongoPool = require("./mongoPool");

function findUserByUsername(username) {
    return new Promise(function(resolve, reject) {
        MongoPool.getInstance(function(db) {
            db.db('tchat').collection('user').findOne({
                username: username
            }, function(err, result) {
                if (err) {
                    reject(new Error('database error'));
                }
                resolve(result);
            });
        });
    });
}

function findUserByEmail(email) {
    return new Promise(function(resolve, reject) {
        MongoPool.getInstance(function(db) {
            db.db('tchat').collection('user').findOne({
                email: email
            }, function(err, result) {
                if (err) {
                    reject(new Error('database error'));
                }
                resolve(result);
            });
        });
    });
}

function checkUserNotExist(username, email) {
    return new Promise(function(resolve, reject) {
        MongoPool.getInstance(function(db) {
            db.db('tchat').collection('user').findOne({
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
            db.db('tchat').collection('user').insertOne({
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
    findUserByUsername(account)
}

module.exports = {
    addUser
}