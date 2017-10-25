var nodemailer = require('nodemailer');

var mg = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: 'key-2483ab4210c783f9455f21881ba8a152',
    domain: 'sandbox5f654a90e2fe42faa458792bd8c7bd15.mailgun.org'
  }
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
