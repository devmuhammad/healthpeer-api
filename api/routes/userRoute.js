const router = require("express").Router();
const user_controller = require('../controller/userController');

const userRouter = function (router) {

// User Routes
    router.get('/getusers', user_controller.userslist); // endpoint for retrieving all users GET
    router.post('/create', user_controller.createUser); //endpoint for creating new user POST

    router.get('/get/:userId', user_controller.userbyid);  //endpoint for retrieving single user by id GET
    router.put('/update/:userId', user_controller.updateuserProfile); //endpoint to update users profile  PUT
    router.delete('/delete/:userId', user_controller.deleteUser); //endpoint to delete user by Id DELETE
};

module.exports = userRouter(router);