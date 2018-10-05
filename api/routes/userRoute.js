const router = require("express").Router();
const user_controller = require('../controller/userController');
var verrToken = require('../middleware/verrToken');

// User Routes
    router.get('/getusers', user_controller.userslist); // endpoint for retrieving all users GET
    // router.post('/create', user_controller.createUser); //endpoint for creating new user POST
    router.get('/get/:userId', user_controller.userbyid);  //endpoint for retrieving single user by id GET
    router.put('/update', user_controller.updateuserProfile); //endpoint to update users profile  PUT
    router.delete('/delete/:userId', user_controller.deleteUser); //endpoint to delete user by Id DELETE

//Medical Information Route
    router.post('/updatemedInfo', user_controller.updateMedInfo)

module.exports = router;
