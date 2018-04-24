const router = require("express").Router();
const bloodBankController = require('../controller/bloodBankController');

//Blood bank Routes
    router.post('/request/send', bloodBankController.requestForBlood) //endpoint for sending out request for blood POST

    router.put('/request/edit', bloodBankController.editBloodRequest)// endpoint for editing already sent out request PUT

    router.get('/request/get', bloodBankController.fetchAllUserRequest);//endpoint fetching all user request GET 

    router.post('/request/terminate', bloodBankController.terminateRequestOnFulfillment);//endpoint for terminating request POST

module.exports = router;
