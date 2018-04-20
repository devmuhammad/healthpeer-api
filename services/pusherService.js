const Chatkit = require('pusher-chatkit-server');
const CONFIG = require('../config').pusher
const hpChatServer = new Chatkit.default({
  instanceLocator: CONFIG.instance_locator,
  key: CONFIG.key,
})

exports.CREATE_USER = (userId, username, avatar, callback) => {
  hpChatServer.createUser({id: userId, name: username, avatarURL: avatar}).then((res) => {
    return callback(res, null)
  })
  .catch((err) => {
    return callback(false, err)
  });  
}

exports.GET_JOINABLE_ROOMS = (userId, callback) => {
  hpChatServer.getUserJoinableRooms({userId: userId}).then((res) => {
    callback(res, null);
  }).catch((err) => {
    callback(false, err)
  });
}

exports.CREATE_ROOM = (creator, roomName, roomMembers, isPrivate, callback) => {
  hpChatServer.createRoom({creatorId: creator, name: roomName, userIds:roomMembers, isPrivate: isPrivate}).then((res) => {
    return callback(res, null)
  }).catch((err) => {
    return callback(false, err)
  })
}

exports.GET_USER = (callback) => {
  hpChatServer.getUsers().then((res) => {
    return callback(res, null)
  }).catch((err) => {
    return callback(false, err)
  });
}  

exports.GET_USER_ROOMS = (userId, callback) => {
  hpChatServer.getUserRooms({ userId: userId }).then((res) => {
    return callback(res, null)
  }).catch((err) => {
    return callback(false, err)
  });
}