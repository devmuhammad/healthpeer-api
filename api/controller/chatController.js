const {GET_USER, GET_USER_ROOMS} = require('../../services/pusherService');

exports.getUserConsultations = function (res, req) {
  return GET_USER_ROOMS("1", function(res, err) {
    console.log("rooms"+res)
  })
}