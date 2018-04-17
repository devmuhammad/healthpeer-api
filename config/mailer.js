
var nodemailer = require('nodemailer');

exports.transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
           user: 'shuaibola12@gmail.com',
           pass: '2nov2011745'
       }
   });

   exports.mailOptions = {
    from: 'shuaibola12@gmail.com', // sender address
    to: '', // list of receivers
    subject: 'HealthPeer Password Recovery ', // Subject line
    html: '<p></p>'// plain text body
  };
 