const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
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
                    ip: settings.ip,
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

module.exports = {
    emailTransporter,
    sendEmail
}