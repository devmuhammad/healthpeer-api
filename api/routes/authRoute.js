const Router = require("express").Router();
const auth_controller = require('../controller/authController');

const authRouter = (router = Router) => {

//Authentication Routes
    router.get('/auth/me', auth_controller.signedHeader) //endpoint for checking tokens in header GET

    router.post('/auth/login', auth_controller.login)// endpoint for login GET

    router.post('/auth/logout', auth_controller.logout);//endpoint for logout POST 

    router.post('/auth/register', auth_controller.register);//endpoint for register user POST

    router.post('/auth/resetpassword', auth_controller.resetPassword);//endpoint for password Reset POST

    router.post('/auth/signreset/:resetkey', auth_controller.signedPassReset);//endpoint for verifying token validity POST

    router.post('/auth/confirmresetpassword/:resetkey', auth_controller.resetPasswordFinal);//endpoint for password full reset POST

};

module.exports = authRouter;