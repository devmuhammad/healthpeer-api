const BloodBank = require('mongoose').model('BloodBank')
      , User    = require('mongoose').model('User')
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


