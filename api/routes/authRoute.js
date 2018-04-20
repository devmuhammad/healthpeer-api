const router = require("express").Router();
const auth_controller = require('../controller/authController');



//Authentication Routes
    router.get('/me', auth_controller.signedHeader) //endpoint for checking tokens in header GET

    router.post('/login', auth_controller.login)// endpoint for login GET

    router.post('/logout', auth_controller.logout);//endpoint for logout POST 

    router.post('/register', auth_controller.register);//endpoint for register user POST

    router.post('/resetpassword', auth_controller.resetPassword);//endpoint for password Reset POST

    router.post('/signreset/:resetkey', auth_controller.signedPassReset);//endpoint for verifying token validity POST

    router.post('/confirmresetpassword/:resetkey', auth_controller.resetPasswordFinal);//endpoint for password full reset POST


module.exports = router;
