const jwt     = require('jsonwebtoken');
const Session = require('mongoose').model('Session');
const CONFIG  = require('../../config').pusher
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

/**
 * Provide session token with expiry date
 * @param {JSON} req 
 * @param {JSON} res 
 */
exports.tokenProvider = function (req, res) {
    let sessionId = req.params.sessionId;
    let timestamp =  Math.floor(Date.now() / 1000)
    let expiryTime = Math.floor(Date.now() / 1000) + (60 * 60)

    Session.findOne({
        "_id": sessionId,
        "sessionComplete": false
    }).exec((err, session) => {
        if(err) return res.status(500).json({"access_token": null, "expires_in": 0})
        if(!session) return res.status(401).json({"access_token": null, "expires_in": 0})

        let user = session.members.patient;

        jwt.sign({
          "instance": CONFIG.instance_locator,
          "iss": CONFIG.key,
          "iat": timestamp,
          "exp": expiryTime,
          "sub": user
        }, CONFIG.secret, function(err, token) {
          
          if(err) return res.status(500).json({"access_token": null, "expires_in": 0});
          elseif(token)
          {
            return res.status(200).json({
              "access_token": token, 
              "expires_in": 14400
            })
          }
        })
    })
}