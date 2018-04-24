const {CREATE_ROOM}  = require("../../services/pusherService")
const mongoose       = require('mongoose')
const User           = mongoose.model('User')
const Session        = mongoose.model('Session')
const config = require('../../config/index')
const moneywave = require('../../services/paymentService')(config.moneywave.apiKey,config.moneywave.secret);


/**
 * Buy a session (using debit card)
 * @param {*} req 
 * @param {*} res 
 */
exports.subscribeWithCard = function(req, res){
  User.findById(req.body.userId, function(err, user){
      if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
  if (user) {
      firstname = user.firstName;
      lastname = user.lastName;
      phonenumber = user.phoneNumber;
      email = user.email
  let body = {
      'firstname': firstname, 
      'lastname': lastname,
      'phonenumber':phonenumber, 
      'email': email, 
      'recipient': "wallet", 
      'card_no': req.body.card_no, 
      'cvv': req.body.cvv, 
      'pin': req.body.pin,
      'charge_auth': "PIN",
      'expiry_year': req.body.expiry_year, 
      'expiry_month': req.body.expiry_month, 
      'apiKey': config.moneywave.apiKey, 
      'amount': req.body.amount, 
      'fee':0, 
      'redirecturl':g, // endpoint to save transaction details
      'medium': req.body.requestmedium,
  }
  if(req.body.pin){
      moneywave.CardToWallet.chargeLocalCard(body, function(err, res){
          if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
  
  })
}else
  moneywave.CardToWallet.charge(body, function(err, trfinfo){
      if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}


  })
}
})
};


/**
 * Buy a session (through account number)
 * @param {*} req 
 * @param {*} res 
 */
exports.subscribeWithAccount = function(req, res){
  User.findById(req.body.userId, function(err, user){
      if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
  if (user){
      firstname = user.firstName;
      lastname = user.lastName;
      phonenumber = user.phoneNumber;
      email = user.email
  let body = {
      'firstname':firstname, 
      'lastname':lastname,
      'phonenumber':phonenumber, 
      'email': email, 
      'recipient': "wallet", 
      'charge_with': "account", 
      'sender_account_number': req.body.accountnumber, 
      'sender_bank': req.body.bank, 
      'apiKey': config.moneywave.apiKey, 
      'amount': req.body.amount, 
      'fee':0, 
      'redirecturl':g, // endpoint to save transaction details
      'medium': req.body.requestmedium,
  }
  moneywave.AccountToWallet.transfer(body, function(err, trfinfo){
      if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}


  })
}
})
};

/**
 * Buy a session (using internet banking)
 * @param {*} req 
 * @param {*} res 
 */
exports.subscribeWithInternetPay = function(req, res){
  User.findById(req.body.userId, function(err, user){
      if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
  if (user){
      firstname = user.firstName;
      lastname = user.lastName;
      phonenumber = user.phoneNumber;
      email = user.email
  let body = {
      'firstname': firstname, 
      'lastname': lastname,
      'phonenumber': phonenumber, 
      'email': email, 
      'recipient': "wallet", 
      'charge_with': "ext_account", 
      'charge_auth': "INTERNETBANKING",
      'sender_bank': req.body.bank, 
      'apiKey': config.moneywave.apiKey, 
      'amount': req.body.amount, 
      'fee':0, 
      'redirecturl':g, // endpoint to save transaction details
      'medium': req.body.requestmedium,
  }
  moneywave.PayWithInternetBanking.transfer(body, function(err, trfinfo){
      if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}


  })
}
})
};

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
 * Start session with previous consultant
 * @param {JSON:{Sessionid, requestedBy}} req 
 * @param {*} res 
 */
exports.reactivateSession = function (req, res) {

    //search for session and assign previous consultant
    Session.findById(req.body.sessionId).exec(function (err, prevSession) {
        if(err) return res.status(500).json({"status":"error", "message": "Something went wrong!", "data":null})
        if(!prevSession) return res.status(400).json({"status": "error", "message": "Unable to find session.", "data":null})

        let consultant = prevSession.members.consultant
        let patient = prevSession.members.patient

        // check if user has bought sessions
        User.findOne({
            "_id": patient,
            "availableSessionCount": { $gt: 0 }
        }).exec(function(err, user) {
            
            if(err) return res.status(500).json({"status":"error", "message": "Something went wrong!"})
            if(!user) return res.status(400).json({"status": "error", "message": "Purchase a session bundle."})

            let creator = req.body.requestedBy
                ,sessionName = prevSession.name
                ,members = [patient, consultant]
                ,private = true

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
                "message": "Unable to reactivate session. Try again.",
                "data": null
              })
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
        consultationType: {$in: ["General", req.body.consultationType]}
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
            newSession.sessionType = req.body.consultationType
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


/**
 * List types of session available [GET]
 * @param {*} req 
 * @param {*} res 
 */
exports.listSessionType = function (req, res) {

}
