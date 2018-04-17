module.exports = function (app) {

var user_controller = require('../controller/userController');

// User Routes


    app.get('/user', user_controller.userslist); // endpoint for retrieving all users GET
    app.post('/user', user_controller.createUser); //endpoint for creating new user POST

    app.get('/user/:userId', user_controller.userbyid);  //endpoint for retrieving single user by id GET
    app.put('/user/:userId', user_controller.updateuserProfile); //endpoint to update users profile  PUT
    app.delete('/user/:userId', user_controller.deleteUser); //endpoint to delete user by Id DELETE
    

};