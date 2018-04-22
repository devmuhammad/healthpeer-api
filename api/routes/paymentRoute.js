const router = require("express").Router();
const pay_controller = require('../controller/paymentController');

// consultant Routes
    router.post('/withdraw', pay_controller.makeWithdrawal); // endpoint for making withdrawal to consultant account POST
    
    router.get('/banklist',  pay_controller.listBank); //endpoint for listing banks GET
    
    router.post('/totalcharge',  pay_controller.getTotalCardCharge); //endpoint for getting total charges to be paid POST 
   
    router.post('/retrytrans', pay_controller.RetryFailedTransaction);  //endpoint for retrying Failed transactions POST
    
    router.post('/transtatus', pay_controller.transactionStatus); //endpoint to get withdrawal transaction status  POST 
   
    router.post('/validateacct', pay_controller.validateAccountNumber); //endpoint to validate Account Number POST


    



module.exports = router;
