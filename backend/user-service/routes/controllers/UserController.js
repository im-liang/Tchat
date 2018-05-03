const userDB = require('../../database/userDB');
const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'gofaraway456@gmail.com',
        pass: 'yourpassword'
    }
});

function addUser(req, res) {
  userDB.addUser(req.body.username, req.body.email, req.body.password).then(function(result) {
    console.log(result);
    return res.status(200).send({status: 'OK', success: 'account created'});
  }).catch(function(err) {
    return res.status(200).send({status: 'error', error: err.message});
  });
}

function sendVerificationEmail(email) {

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
