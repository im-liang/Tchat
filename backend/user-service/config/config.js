const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const cryptoJS = require("crypto-js");
const settings = require("./config.json");

emailTransporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
        user: settings.email.user,
        pass: settings.email.password
    }
}));

function sendEmail(email, key) {
    return new Promise(function(resolve, reject) {
        fs.readFile(path.join(__dirname, './email.html'), {
            encoding: 'utf-8'
        }, function(err, html) {
            if (err) {
                reject(new Error(err));
            } else {
                let template = handlebars.compile(html);
                let replacements = {
                    domain: settings.domain,
                    email: email,
                    key: key
                };
                let htmlToSend = template(replacements);
                console.log(htmlToSend);
                let mailOptions = {
                    from: settings.email.user,
                    to: email,
                    subject: settings.email.subject,
                    html: htmlToSend
                };
                emailTransporter.sendMail(mailOptions, function(error, response) {
                    if (error) {
                        reject(new Error(error));
                    }
                });
            }
        });
    })
}

function encryptString(message) {
    return cryptoJS.AES.encrypt(message, settings.secret).toString();
}

function decryptString(code) {
    let bytes = cryptoJS.AES.decrypt(code, settings.secret);
    return bytes.toString(cryptoJS.enc.Utf8);
}

module.exports = {
    emailTransporter,
    sendEmail,
    encryptString,
    decryptString
}