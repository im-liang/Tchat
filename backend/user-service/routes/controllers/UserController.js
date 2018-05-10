const nodemailer = require('nodemailer');
const userDB = require('../../database/userDB');
const config = require('../../config/config');
const settings = require("../../config/config.json");

function addUser(req, res) {
    userDB.addUser(req.body.username, req.body.email, req.body.password).then(value => {
        config.sendEmail(value.email, value.emailToken);
        return res.status(200).send({
            status: 'OK',
            success: 'account created'
        });
    }, reason => {
        return res.status(200).send({
            status: 'error',
            error: reason
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