const router            = require("express").Router();
const sessionController = require('../controller/sessionController');

//Authentication Routes
    router.post('/subscribe', sessionController.subscribeForSessions) //endpoint for purchasing sessions GET

    router.post('/activate', sessionController.activateSession)// endpoint for activating new sessions GET

    router.post('/terminate', sessionController.endSession);//endpoint for ending sessions POST 

module.exports = router;
