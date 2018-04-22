const router = require("express").Router();
const moneywave = require('../../services/paymentService')("ts_ZISPSJAKM13ZACA4447N","ts_AT8TI5W6VQM7ZV7E6EI6ALQ6LM3PBH");



// consultant Routes
    router.post('/transfer', moneywave.WalletFunding.CardToWallet); // endpoint for making payment with card POST
    router.post('/transfer', moneywave.WalletFunding.AccountToWallet); //endpoint for making payment with Account POST
    router.post('/transfer', moneywave.WalletFunding.AccountToWallet);
    router.get('/get/:consultantId', consultant_controller.consultantbyid);  //endpoint for retrieving single consultant by id GET
    router.put('/update/:consultantId', consultant_controller.updateconsultantProfile); //endpoint to update consultants profile  PUT
    router.delete('/delete/:consultantId', consultant_controller.deleteConsultant); //endpoint to delete consultant by Id DELETE


    



module.exports = router;
