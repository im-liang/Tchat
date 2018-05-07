const fs = require('fs');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const settings = require("./config.json");

var config = {};
config.emailTransporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: settings.email.user,
        pass: settings.email.password
    }
}));

config.readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

module.exports = config;