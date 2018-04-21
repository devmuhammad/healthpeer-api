const router            = require("express").Router();
const sessionController = require('../controller/sessionController');

//Authentication Routes
    router.post('/subscribe/card', sessionController.subscribeWithCard) //endpoint for purchasing sessions POST

    router.post('/subscribe/card', sessionController.subscribeWithAccount) //endpoint for purchasing sessions POST

    router.post('/subscribe/card', sessionController.subscribeWithInternetPay) //endpoint for purchasing sessions POST

    router.post('/activate', sessionController.activateSession)// endpoint for activating new sessions POST

    router.post('/terminate', sessionController.endSession);//endpoint for ending sessions POST 

module.exports = router;
