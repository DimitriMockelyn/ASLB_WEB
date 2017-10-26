var nodemailer = require('nodemailer');

var mg = require('nodemailer-mailgun-transport');
var {getConfig} = require('../../config');
// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: getConfig().authMail
}
var nodemailerMailgun = nodemailer.createTransport(mg(auth));
exports.sendMail = function(dests, objet, message) {
    nodemailerMailgun.sendMail({
        from: 'dimitri.mockelyn@gmail.com',
        to: dests, // An array if you have multiple recipients.
        subject: objet,
        text: message,
      }, function (err, info) {
        if (err) {
          console.log('Error: ' + err);
        }
        else {
          console.log('Response: ' + info);
        }
      });
}
