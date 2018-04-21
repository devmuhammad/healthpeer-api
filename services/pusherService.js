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
  hpChatServer.createRoom({
    creatorId: creator, 
    name: roomName, 
    userIds:roomMembers, 
    isPrivate: isPrivate
  }).then((res) => {
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

exports.CREATE_GLOBAL_ROLE = (roleName, permissions, callback) => {
  hpChatServer.createGlobalRole({ name: roleName, permissions: permissions})
    .then((res) => {
      callback(res, null)
    }).catch((err) => {
      callback(false, err)
    })
}

exports.ASSIGN_GLOBAL_GROUP_TO_USER = (userId, userGroup, callback) => {
  hpChatServer.assignGlobalRoleToUser({ userId: userId, roleName: userGroup })
    .then((res) => {
      callback(res, null)
    }).catch((err) => {
      callback(false, err);
    });
}

exports.ASSIGN_ROOM_GROUP_TO_USER = (userId, roleName, roomId, callback) => {
  hpChatServer.assignRoomRoleToUser({userId: userId, roleName: roleName, roomId: roomId,})
  .then((res) => {
    callback(res, null)
  }).catch((err) => {
    callback(false, err);
  });
}

exports.CREATE_ROOM_ROLE = (roleName, permissions, callback) => {
  hpChatServer.createRoomRole({name: roleName, permissions: permissions})
    .then((res) => {
      callback(res, null)
    }).catch((err) => {
      callback(false, err);
    });
}

exports.LIST_ALL_CREATED_ROLES = (callback) => {
  hpChatServer.getRoles()
  .then((res) => {
    callback(res, null)
  }).catch((err) => {
    callback(false, err);
  });  
}