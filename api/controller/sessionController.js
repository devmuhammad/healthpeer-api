const {CREATE_ROOM}  = require("../../services/pusherService")
const mongoose       = require('mongoose')
const User           = mongoose.model('User')
const Session        = mongoose.model('Session')


/**
 * Buy a session
 * @param {id,requestedBy,consultationType} req 
 * @param {JSON} res 
 */
exports.subscribeForSessions = function (req, res) {

}

/**
 * if all consultants are not available (i.e not online)
 * @param {*} req 
 * @param {*} res 
 */
const offlineActivation = function (req, res) {
  //search for available consultant with least number consultations
  User.find({
    accountType: "consultant",
    consultationType: { $in: ["general", req.body.consultationType] }
  })
    .sort({ totalSessions: 1 })
    .exec(function (err, consultants) {

        let selectedConsultant = consultants[0]._id
        let creator = req.body.requestedBy
          , sessionName = req.body.patient + "::" + selectedConsultant.username
          , members = [user._id, selectedConsultant._id]
          , private = true

        //create the session and save
        let newSession = new Session()
        newSession.name = sessionName
        newSession.members.patient = members[0]
        newSession.members.consultant = members[1]

        //save new session
        newSession.save().then((session) => {
          CREATE_ROOM(creator, sessionName, members, private, function (res, err) {
            if (err) return res.status(500).json({ status: "error", message: "Something went wrong!", data: null });
            else {
              user.availableSessionCount -= 1 //reduce available session count and save
              user.save().then((res) => console.log(res.id + "session -1")).catch((err) => console.log(user._id + "session 0"))

              return res.status(200).json({
                "status": "success",
                "message": "Session created successfully.",
                "data": res
              })
            }
          })
        })
        .catch((err) => {
          res.status(500).json({
            "status": "error",
            "message": "Unable to activate session.",
            "data": null
          })
        })
    })
}


/**
 * Start a new session
 * @param {id,requestedBy,consultationType} req 
 * @param {JSON} res 
 */
exports.activateSession = function (req, res) {
  let patient = req.body

  User.findOne({ "_id":patient.id, "availableSessionCount": {$gt : 0} }, (err, user) => {
    if (err) return res.status(500).json({status:"error", message:"Something went wrong!", data: null});
    if( !user ) return res.status(401).json({status:"error", message:"You have to purchase a session.", data: null});

      //search for available consultant with least number consultations
      User.find({
        accountType: "consultant",
        availability: true,
        consultationType: {$in: ["general", req.body.consultationType]}
      })
      .sort({totalSessions: 1})
      .exec(function(err, consultants) {

        if(consultants.length > 0)
        {
            let selectedConsultant = consultants[0]._id
            let creator = req.body.requestedBy
                , sessionName = req.body.patient + "::" + selectedConsultant.username
                , members = [user._id, selectedConsultant._id]
                , private = true

            //create the session and save
            let newSession = new Session()
            newSession.name = sessionName
            newSession.members.patient = members[0]
            newSession.members.consultant = members[1]

            //save new session
            newSession.save().then((session) => {

              CREATE_ROOM(creator, sessionName, members, private, function (res, err) {
                if (err) return res.status(500).json({status:"error", message:"Something went wrong!", data: null});
                else {
                  user.availableSessionCount -= 1 //reduce available session count and save
                  user.save().then((res) => console.log(res.id+"session -1")).catch((err) => console.log(user._id+"session 0"))
                  
                  return res.status(200).json({
                    "status": "success",
                    "message": "Session created successfully.",
                    "data" : {
                      "pusherResponse": res,
                      "healthpeerResponse": session
                    }
                  })
                }
              })

            })
            .catch((err) => {
              res.status(500).json({
                "status": "error",
                "message": "Unable to activate session.",
                "data" : null
              })
            })
        }else {
          return offlineActivation(req, res);
        }
      })
  })
}


/**
 * Terminate session
 * @param {JSON{conversations, sessionId}} req 
 * @param {JSON} res 
 */
exports.endSession = function (req, res) {
    // find intended session and terminate
    Session.findByIdAndUpdate(
        req.body.sessionId,
        {
          $set: {"conversations.0": req.body.conversation },
          sessionComplete: true
        },
        {'lean': true}
    ).exec(function(err, session) {
        
        if(err) return res.status(500).json({"status":"error", "message": "Something went wrong!", "data": null })
        if(!session) return res.status(400).json({"status":"error", "message": "Session was not activated.", "data": null })

        let consultant_id = session.members.consultant

        //find consultant and pay him
        User.findByIdAndUpdate(
          consultant_id,
          {
            $inc: { balance: 500 } 
          },
          {'lean': true}
        ).exec(function(err, consultant) {

          if(err) return res.status(500).json({"status":"error", "message": "Something went wrong!", "data": null })
          if(!consultant) res.status(400).json({"status":"error", "message": "Your balance could not be updated!", "data": null })

          return res.status(200).json({
            "status":"success", 
            "message": "Session completed!", 
            "data": consultant
          })
        })
    })
}