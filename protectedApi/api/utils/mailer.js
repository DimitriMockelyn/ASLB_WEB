var nodemailer = require('nodemailer');

var mg = require('nodemailer-mailgun-transport');
var {getConfig} = require('../../config');
var sendmail = require('sendmail')({silent: true})
// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: getConfig().authMail
}
var nodemailerMailgun = nodemailer.createTransport(mg(auth));
exports.sendMailMailgun = function(dests, objet, message) {
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

let transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 2525,
  secure: false, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'dimitri.mockelyn@gmail.com',
    pass: 'CJyMTP5deQYw'
  }
});

exports.sendMail = function(dests, objet, message) {
    
  let mailOptions = {
      from: 'aslb@laboursidiere.com', // sender address
      to: dests.join(", "), 
      subject: objet,
      html: message
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info); 
  });
}

exports.sendMailWithAppointment = function(dests, objet, message, content) {
    
  let mailOptions = {
      from: 'aslb@laboursidiere.com', // sender address
      to: dests.join(", "), 
      subject: objet,
      html: message,
      attachments: [{
        contentType: 'text/calendar; charset="utf-8"; method=REQUEST',
        content: content,
        filename: 'invitation.ics'
      }]
  };
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log( info); 
  });
}

exports.sendMailNoSmtp = function(dests, objet, message) {
  sendmail({
      from: 'email.aslb@gmail.com',
      to: dests.join(", "), 
      subject: objet,
      html: message,
    }, function(err, reply) {
      console.log(err && err.stack);
      console.log(reply);
  });
}
