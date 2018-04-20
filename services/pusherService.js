const Chatkit = require('pusher-chatkit-server');
const CONFIG = require('../config').pusher
const hpChatServer = new Chatkit.default({
  instanceLocator: CONFIG.instance_locator,
  key: CONFIG.key,
})

exports.CREATE_USER = () => {
  
}

exports.GET_USER = () => {
  hpChatServer.getUsers().then((res) => {
    console.log(res);
  }).catch((err) => {
    console.log(err);
  });
}  

exports.GET_USER_ROOMS = (userId, callback) => {
  hpChatServer.getUserRooms({ userId: userId }).then((res) => {
    console.log(res);
    return callback(res, null)
  }).catch((err) => {
    console.log(err);
    return callback(false, err)
  });
}