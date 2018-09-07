
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

exports.transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: false,
    // requireTLS: true,
    auth: {
           user: 'healthpeerng@gmail.com',
           pass: 'HealthPeer!'
       }
   }));

   exports.mailOptions = {
    from: '"Healthpeer NG" <healthpeerng@gmail.com>', // sender address
    to: '', // list of receivers
    subject: '', // Subject line
    html: '<p></p>'// plain text body
  };
 