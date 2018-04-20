const router = require("express").Router();
const consultant_controller = require('../controller/consultInfoController');


// consultant Routes
    router.get('/get/', consultant_controller.consultantslist); // endpoint for retrieving all consultants GET
    router.post('/create', consultant_controller.createConsultant); //endpoint for creating new consultant POST

    router.get('/get/:consultantId', consultant_controller.consultantbyid);  //endpoint for retrieving single consultant by id GET
    router.put('/update/:consultantId', consultant_controller.updateconsultantProfile); //endpoint to update consultants profile  PUT
    router.delete('/delete/:consultantId', consultant_controller.deleteConsultant); //endpoint to delete consultant by Id DELETE


    



module.exports = router;
