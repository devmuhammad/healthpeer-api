const {CREATE_ROOM}  = require("../../services/pusherService")
const mongoose       = require('mongoose')
const User           = mongoose.model('User')
const Session        = mongoose.model('Session')
const config = require('../../config/index')
const moneywave = require('../../services/paymentService')(config.moneywave.apiKey,config.moneywave.secret);


/**
 * Buy a session
 * @param {*} req 
 * @param {*} res 
 */
exports.subscribeWithCard = function(req, res){
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
      'phonenumber':phonenumber, 
      'email': email, 
      'recipient': wallet, 
      'card_no': req.body.card_no, 
      'cvv': req.body.cvv, 
      'pin': req.body.pin,
      'charge_auth': PIN,
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
          if (err) { return res.status(500).json({status:"error", message:"Problem contacting Server"});}
  
  })
}else
  moneywave.CardToWallet.charge(body, function(err, res){
      if (err) { return res.status(500).json({status:"error", message:"Problem contacting Server"});}


  })
}
})
};

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
      'recipient': wallet, 
      'charge_with': account, 
      'sender_account_number': req.body.accountnumber, 
      'sender_bank': req.body.bank, 
      'apiKey': config.moneywave.apiKey, 
      'amount': req.body.amount, 
      'fee':0, 
      'redirecturl':g, // endpoint to save transaction details
      'medium': req.body.requestmedium,
  }
  moneywave.AccountToWallet.transfer(body, function(err, res){
      if (err) { return res.status(500).json({status:"error", message:"Problem contacting Server"});}


  })
}
})
};
exports.validateAccount = function(req, res){

}

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
  moneywave.PayWithInternetBanking.transfer(body, function(err, res){
      if (err) { return res.status(500).json({status:"error", message:"Problem contacting Server"});}


  })
}
})
};

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