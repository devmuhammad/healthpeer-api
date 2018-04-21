const {
  GET_USER, 
  GET_USER_ROOMS,
  CREATE_USER,
  CREATE_ROOM
} = require('../../services/pusherService');

exports.getUserConsultations = function (req, res) {
  return GET_USER_ROOMS("1", function(res, err) {
    console.log("rooms"+res)
  })
}