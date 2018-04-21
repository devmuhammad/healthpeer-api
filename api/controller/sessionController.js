const {CREATE_ROOM}  = require("../../services/pusherService")
const mongoose       = require('mongoose')
const User           = mongoose.model('User')
const Session        = mongoose.model('Session')



exports.subscribeForSessions = function (req, res) {

}

/**
 * Start a new session
 * @param {id,requestedBy,consultationType} req 
 * @param {JSON} res 
 */
exports.activateSession = function (req, res) {
  let patient = req.body

  User.findById(patient.id, (err, user) => {
    if (err) return res.status(500).json({status:"error", message:"Something went wrong!", data: null});
    if( !user ) return res.status(401).json({status:"error", message:"Patient does not exist!", data: null});

    if(user.availableSessionCount > 1)
    {
      //search for a consultant
      User.find({
        accountType: "consultant",
        availability: true,
        consultationType: {$in: ["general", req.body.consultationType]}
      })
      .sort({totalSessions: 1})
      .exec(function(err, consultants) {

        let selectedConsultant = consultants[0]._id
        let creator = req.body.requestedBy
            ,sessionName = req.body.patient + "::" + selectedConsultant.username
            ,members = [user._id, selectedConsultant._id]
            ,private = true

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
              user.availableSessionCount -= user.availableSessionCount //reduce available session count and save
              user.save().then((res) => console.log(res.id+"session -1")).catch((err) => console.log(user._id+"session 0"))
              
              return res.status(200).json({
                "status": "success",
                "message": "Session created successfully.",
                "data" : res
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
        
      })

    }else { // if user has no session available
      res.status(401).json({
        "status": "error",
        "message": "You have to purchase a session.",
        "data" : null
      })
    }
  })
}


/**
 * Terminate session
 * @param {*} req 
 * @param {*} res 
 */
exports.endSession = function (req, res) {

}