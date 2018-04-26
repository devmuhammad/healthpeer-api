const BloodBank = require('../models').BloodBank
      , User    = require('../models').user
      , jwt     = require('jsonwebtoken')
      , config  = require('../../config').app;

/**
 * Send out request for blood
 * @param {*} req 
 * @param {*} res 
 */
exports.requestForBlood = function (req, res) {
    let token = req.headers["x-access-token"]

    jwt.verify(token, config.secret, function(err, decoded) {
        if(err) return res.status(401).json({"status":"error", "message": "Unauthorized access", "data": null})
      
        let user_id = decoded.id

        User.findById(user_id, function(err, user) {
          if(err) return res.status(500).json({"status":"error", "message": "Unable to process request. Try again", "data": null})
          if(!user) return res.status(401).json({"status":"error", "message": "Unauthorized access", "data": null})

          let newBloodRequest = new BloodBank(req.body)

          newBloodRequest.save( function (err,bloodRequest) {
            if(err) return res.status(500).json({"status":"error", "message": "Unable to process request. Try again", "data": null})
            if(!bloodRequest ) return res.status(500).json({"status":"error", "message": "Unable to process request. Try again", "data": null})

            user.bloodBank.push(bloodRequest)
            user.save(function(err, updatedUser) {
              if(err) return res.status(500).json({"status":"error", "message": "Unable to process request. Try again", "data": null})
              if(!updatedUser) return res.status(500).json({"status":"error", "message": "Unable to process request. Try again", "data": null})

              res.status(200).json({
                "status": "success",
                "message": "Request successfully created",
                "data": newBloodRequest
              })

            })
          })       
        })    
    })
}

/**
 * Edit already sent out request
 * @param {JSON: {requestId, bloodGroup, contactPhoneNumber, deliveryPoint, state}} req 
 * @param {JSON} res 
 */
exports.editBloodRequest = function (req, res) {
    if(!req.body.requestId) return res.status(400).json({"status":"error", "message":"Select a request to edit"});

    BloodBank.findOneAndUpdate( 
        {
          "_id": req.body.requestId,
          "statusOfRequest": "PENDING"
        },
        {
          bloodGroup: req.body.bloodGroup,
          contactPhoneNumber: req.body.contactPhoneNumber,
          deliveryPoint: req.body.deliveryPoint,
          state: req.body.state,
        },
        {new: true}
    ).exec(function(err, bloodRequest) {

        if(err) return res.status(500).json({"status":"error", "message": "Unable to edit request"})
        if(!bloodRequest) return res.status(400).json({"status":"error", "message": "Selected request has already been fulfilled."})

        res.status(200).json({
          "status": "success",
          "data": bloodRequest,
          "message": "Changes saved!"
        })
    })
}

/**
 * Stop broadcast of request after donor have been matched
 * @param {requestId} req 
 * @param {*} res 
 */
exports.terminateRequestOnFulfillment = function (req, res) {
    let token = req.headers["x-access-token"];

    jwt.verify(token, config.secret, function(err, decoded) {
        if(err) return res.status(403).json({"status": "error", "message":"You don't have access to terminate this request"})
        
        let user_id = decoded.id
        
        User.findById(user_id, function(err, user) {
          if(err) return res.status(500).json({"status": "error", "message":"Unable to process request. Retry."})
          if(!user) return res.status(404).json({"status": "error", "message":"User not found!"})

          BloodBank.findByIdAndUpdate(
            req.body.requestId,
            {
              $set : { statusOfRequest: "FULFILLED"}
            },
            {"lean" : true, "new": true}
          ).exec(function(err, updatedRequest) {
            if(err) return res.status(500).json({"status": "error", "message":"Unable to process request. Retry."})
            if(!updatedRequest) return res.status(404).json({"status": "error", "message":"Request does not exist!"});

            res.status(200).json({
              "status": "success",
              "message": "Broadcast terminated successfully.",
              "data": updatedRequest
            })
          })
        })
    })
}


/**
 * Fetch user blood request [GET]
 * @param {*} req 
 * @param {JSON} res 
 */
exports.fetchAllUserRequest = function (req, res) {
    let token = req.headers["x-access-token"]

    jwt.verify(token, config.secret, function(err, decoded) {
      if(err) return res.status(403).json({"status": "error", "message":"Unauthorized access."});

      let user_id = decoded.id

      BloodBank.find({requestedBy: user_id}, function(err, requests) {
        if(err) return res.status(500).json({"status": "error", "message":"Unable to process request. Retry."})
        if(!requests) return res.status(404).json({
          "status": "success",
          "message": "User has not sent any request.",
          "data": []
        })
        else {
          res.status(200).json({
            "status": "success",
            "message": "Request fetched successfully.",
            "data": requests
          })
        }
      })
    })
}
