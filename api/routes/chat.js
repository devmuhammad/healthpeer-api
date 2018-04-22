const router            = require("express").Router();
const chatController    = require('../controller/chatController');

//Chat Routes
    router.post('/providetoken', chatController.tokenProvider) //endpoint for providing session token POST

module.exports = router;
