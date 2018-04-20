module.exports = function (app) {

var auth_controller = require('../controller/authController');
var verifyToken = require ('../controller/verifyToken');

//Authentication Routes

    app.get('/auth/me',verifyToken, auth_controller.signedHeader) //endpoint for checking tokens in header GET

    app.get('/auth/verifyToken',verifyToken)
    
    app.post('/auth/login', auth_controller.login)// endpoint for login GET

    app.get('/auth/logout', auth_controller.logout);//endpoint for logout POST 

    app.post('/auth/register', auth_controller.register);//endpoint for register user POST

    app.post('/auth/resetpassword', auth_controller.resetPassword);//endpoint for password Reset POST

    app.post('/auth/signreset/:resetkey', auth_controller.signedPassReset);//endpoint for verifying token validity POST

    app.post('/auth/confirmresetpassword/:resetkey', auth_controller.resetPasswordFinal);//endpoint for password full reset POST

};