
var nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
           user: 'healthpeerng@gmail.com',
           pass: 'HealthPeer!'
       }
   });

   exports.mailOptions = {
    from: 'healthpeerng@gmail.com', // sender address
    to: '', // list of receivers
    subject: 'HealthPeer Password Recovery ', // Subject line
    html: '<p></p>'// plain text body
  };
 