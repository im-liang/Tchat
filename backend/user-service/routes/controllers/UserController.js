const nodemailer = require('nodemailer');
const path = require('path');
const handlebars = require('handlebars');
const uuidv1 = require('uuid/v1');
const userDB = require('../../database/userDB');
const config = require('../../config/config');
const settings = require("../../config/config.json");

function addUser(req, res) {
    config.readHTMLFile(path.join(__dirname, '..', '..', 'config/email.html'), function(err, html) {
        let template = handlebars.compile(html);
        let replacements = {
            ip: settings.ip,
            key: uuidv1()
        };
        let htmlToSend = template(replacements);
        console.log(htmlToSend);
        let mailOptions = {
            from: settings.email.user,
            to: req.body.email,
            subject: settings.email.subject,
            html: htmlToSend
        };
        config.emailTransporter.sendMail(mailOptions, function(error, response) {
            if (error) {
                console.log(error);
            }
        });
    });
    userDB.addUser(req.body.username, req.body.email, req.body.password).then(function(result) {
        return res.status(200).send({
            status: 'OK',
            success: 'account created'
        });
    }).catch(function(err) {
        return res.status(200).send({
            status: 'error',
            error: err.message
        });
    });
}

function login(req, res) {
    return res.status(200).json("OK");
}

function logout(req, res) {
    return res.status(200).json("OK");
}

function verify(req, res) {
    return res.status(200).json("OK");
}

function getUser(req, res) {
    return res.status(200).json("OK");
}

module.exports = {
    addUser,
    login,
    logout,
    verify,
    getUser
};