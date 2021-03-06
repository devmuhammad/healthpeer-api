const {CREATE_ROOM}  = require("../../services/pusherService")
const mongoose       = require('mongoose')
const User           =  require('../models').user
const Session        =  require('../models').session
const Payment        =  require('../models').payment
const config         = require('../../config/index')
const moneywave      = require('../../services/paymentService')(config.moneywave.apiKey,config.moneywave.secret);


/**
 * Buy a session (using debit card)
 * @param {JSON:{amount, card_no, pin, cvv, userId, phoneNumber, quantity, expiry_month, expiry_year, requestmedium}}  
 * @param {*} res 
 */
exports.subscribeWithCard = function(req, res){
  User.findById(req.body.userId, function(err, user){
      if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
  if (user){
     let firstname = user.firstName;
     let lastname = user.lastName;
    // let phonenumber = user.phoneNumber;
     let email = user.email

//MONEYWAVE PARAMS
  let body = {
      'firstname': firstname, 
      'lastname': lastname,
      'phonenumber': req.body.phoneNumber, 
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
      'redirecturl':'', // endpoint to save transaction details
      'medium': req.body.requestmedium,
  }

 //HEALTHPEER PARAMS
  let payInfo = new Payment({
    userId: user._id,
    userName: user.userName,
    email: user.email,
    phoneNumber: req.body.phoneNumber,
    quantity: req.body.quantity,
    payStatus: "Started",
    amount : req.body.amount,
    // chargeMethod: ""      
  })
  
  //SAVE TRANSACTION DETAILS
  payInfo.save( function(err, paystat){
    
    if (err) { return res.status(500).json({status:"error", message:"Problem saving pay Info"});}
    
    if (paystat){
      
      user.payments.push(paystat._id)
      
      user.save(function(err, updatepay){
        
        if (err) { return res.status(500).json({status:"error", message:"Problem updating pay Info"});}
        
        if (updatepay){
          let payId = paystat._id;
           body.redirecturl = 'http://localhost:6990/session/confirmcardpayment/'+payId;

            // SEND HTTP REQUEST TO MONEYWAVE for Local Cards
  if(req.body.pin){
      moneywave.CardToWallet.chargeLocalCard(body, function(err, trfinfo){
         
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
          
        if (trfinfo.status === 'error')   {return res.status(404).json({status:"error", message:trfinfo.code, msg:trfinfo.message,data:trfinfo.data})}
          if (trfinfo.status === 'success') { 
            let newPayUpdate = {
              uniqueRef : trfinfo.data.transfer.flutterChargeReference,
              responseCode: trfinfo.data.transfer.flutterChargeResponseCode,
              responseMsg: trfinfo.data.transfer.flutterChargeResponseMessage,
              cardId: trfinfo.data.transfer.cardId,
             // bankCode: trfinfo.data.transfer.account.bankCode,
             // accountNumber: trfinfo.data.transfer.account.accountNumber,
             // accountName: trfinfo.data.transfer.account.accountName,
              amountCharged:trfinfo.data.transfer.netDebitAmount,
              medium:trfinfo.data.transfer.medium,
              ipAddress:trfinfo.data.transfer.ip,
              payStatus: 'Pending',
             chargeMethod: trfinfo.data.chargeMethod
            }
            
      Payment.findByIdAndUpdate(paystat._id, newPayUpdate, function (err,  newupdatepay){
       
        if (err) { return res.status(500).json({status:"error", message:"Problem updating payment Info"});}
        if (newupdatepay) //{ return res.status(200).json({status:"success", message:" Update Successful", data:newupdatepay});}
        
        return res.status(200).json({status:"success", message:"transaction Successful, Pending Validation - Redirecting ...", });

      });
          }

})
 // SEND HTTP REQUEST TO MONEYWAVE for Other Cards
} else
  moneywave.CardToWallet.charge(body, function(err, trfinfo){
      if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
      if (trfinfo.status === 'error')   {return res.status(404).json({status:"error", message:trfinfo.code,msg:trfinfo.message,data:trfinfo.data})}
      if (trfinfo.status === 'success') { 
        let newPayUpdate = {
              uniqueRef : trfinfo.data.transfer.flutterChargeReference,
              responseCode: trfinfo.data.transfer.flutterChargeResponseCode,
              responseMsg: trfinfo.data.transfer.flutterChargeResponseMessage,
              cardId: trfinfo.data.transfer.cardId,
             // bankCode: trfinfo.data.transfer.account.bankCode,
             // accountNumber: trfinfo.data.transfer.account.accountNumber,
             // accountName: trfinfo.data.transfer.account.accountName,
              amountCharged:trfinfo.data.transfer.netDebitAmount,
              medium:trfinfo.data.transfer.medium,
              ipAddress:trfinfo.data.transfer.ip,
              payStatus: 'Pending',
              chargeMethod: trinfo.data.chargeMethod
        }
  Payment.findByIdAndUpdate(paystat._id, newPayUpdate, function (err,  newupdatepay){
    if (err) { return res.status(500).json({status:"error", message:"Problem updating payment Info"});}
    if (newupdatepay) //{ return res.status(200).json({status:"success", message:" Update Successful, Redirecting ...", data:newupdatepay});}
    return res.status(200).json({status:"success", message:"transaction Successful, Pending Validation - Redirecting ...", });

  })
}
   
})
      
  }
      });
  }
  })
  }
})
};


/**
 * Buy a session (through account number)
 * @param {{JSON:{amount, accountnumber, bank, userId, phoneNumber, quantity, requestmedium}}
 * @param {*} res 
 */
exports.subscribeWithAccount = function(req, res){
  User.findById(req.body.userId, function(err, user){
      if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
  if (user){
    let firstname = user.firstName;
    let lastname = user.lastName;
    //let phonenumber = user.phoneNumber;
    let email = user.email

    //MONEYWAVE PARAMS
  let body = {
      'firstname':firstname, 
      'lastname':lastname,
      'phonenumber': req.body.phoneNumber, 
      'email': email, 
      'recipient': "wallet", 
      'charge_with': "account", 
      'sender_account_number': req.body.accountnumber, 
      'sender_bank': req.body.bank, 
      'apiKey': config.moneywave.apiKey, 
      'amount': req.body.amount, 
      'fee':0, 
      'redirecturl':'', // endpoint to save transaction details
      'medium': req.body.requestmedium,
  }

  //HEALTHPEER PARAMS
  let payInfo = new Payment ({
    userId: user._id,
    userName: user.userName,
    email: user.email,
    phoneNumber: req.body.phoneNumber,
    quantity: req.body.quantity,
    payStatus: "Started",
    amount : req.body.amount,
    chargeMethod: "Account"      
  })

  //SAVE TRANSACTION DETAILS
     payInfo.save( function(err, paystat){
      if (err) { return res.status(500).json({status:"error", message:"Problem saving pay Info"});}
      if (paystat){
        user.payments.push(paystat._id)
      
        user.save(function(err, updatepay){          
          if (err) { return res.status(500).json({status:"error", message:"Problem updating pay Info"});}
          if (updatepay){
            let payId = paystat._id;
             body.redirecturl = 'http://localhost:6990/session/confirmpayment/'+payId

              // SEND HTTP REQUEST TO MONEYWAVE
          moneywave.AccountToWallet.transfer(body, function(err, trfinfo){
            
              if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
            if (trfinfo.status === 'error')   {return res.status(404).json({status:"error", message:trfinfo.code,msg:trfinfo.message,data:trfinfo.data})}
            if (trfinfo.status === 'success') { 
              let newPayUpdate = {
                'uniqueRef' : trfinfo.data.transfer.flutterChargeReference,
                'responseCode': trfinfo.data.transfer.flutterChargeResponseCode,
                'responseMsg': trfinfo.data.transfer.flutterChargeResponseMessage,
                'bankCode': trfinfo.data.transfer.account.bankCode,
                'accountNumber': trfinfo.data.transfer.account.accountNumber,
                'accountName': trfinfo.data.transfer.account.accountName,
                'payStatus': 'Pending',
                amountCharged:trfinfo.data.transfer.netDebitAmount,
                medium:trfinfo.data.transfer.medium,
                ipAddress:trfinfo.data.transfer.ip,
              }
        Payment.findByIdAndUpdate(paystat._id, newPayUpdate, function (err,  newupdatepay){
          if (err) { return res.status(500).json({status:"error", message:"Problem updating payment Info"});}
          if (newupdatepay) //{ return res.status(200).json({status:"success", message:" Update Successful", data:newupdatepay});}
          return res.status(200).json({status:"success", message:"transaction Successful, Pending Validation - Redirecting ...", });

        })
      }
          })
        }
        })
      }
     })
}
})
};


/**
 * Buy a session (using internet banking)
 * @param {{JSON:{amount, bank, userId, phoneNumber, quantity, requestmedium}} 
 * @param {*} res 
 */
exports.subscribeWithInternetPay = function(req, res){

    //FIND USER THAT NEEDS SUBSCRIPTION
    User.findById(req.body.userId, function(err, user) {

      if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}

      if (user) {
        let firstname = user.firstName;
        let lastname = user.lastName;
       // let phonenumber = user.phoneNumber;
        let email = user.email;

        //MONEYWAVE PARAMS
        let body = {
          'firstname': firstname,
          'lastname': lastname,
          'phonenumber': req.body.phoneNumber,
          'email': email,
          'recipient': "wallet",
          'charge_with': "ext_account",
          'charge_auth': "INTERNET_BANKING",
          'sender_bank': req.body.bank,
          'apiKey': config.moneywave.apiKey,
          'amount': req.body.amount,
          'fee': 0,
          'recipient_id':1,
          'redirecturl': '', // endpoint to save transaction details
          'medium': req.body.requestmedium,
        }

        //HEALTHPEER PARAMS
        let payInfo = new Payment({
          'userId': user._id,
          'userName': user.userName,
          'email': user.email,
          'phoneNumber': user.phoneNumber,
          'quantity': req.body.quantity,
          'payStatus': "PENDING",
          'amount': req.body.amount,
          'chargeMethod': "Internet_Banking"
        })

        //SAVE TRANSACTION DETAILS
        payInfo.save(function (err, paystat) {
          if (err) { return res.status(500).json({ status: "error", message: "Problem saving pay Info" }); }

          if (paystat) {
            user.save(function(err, updatepay){   
              if (err) { return res.status(500).json({ status: "error", message: "Problem updating pay Info" }); }

              if (updatepay) {
                let payId = paystat._id;
                body.redirecturl = 'http://localhost:6990/session/updatestatus/'+payId

                // SEND HTTP REQUEST TO MONEYWAVE
                moneywave.PayWithInternetBanking.transfer(body, function (err, trfinfo) {
                  
                  if (err) { return res.status(500).json({ status: "error", message: "Problem contacting Moneywave Server" }); }
                  if (trfinfo.status === 'error') { return res.status(404).json({ status: "error", message: trfinfo.code, msg:trfinfo.message,data:trfinfo.data }) }

                  //IF TRANSACTION IS SUCCESSFULL
                  if (trfinfo.status === 'success') {
                    let newPayUpdate = {
                      'uniqueRef': trfinfo.data.transfer.flutterChargeReference,
                      'responseCode': trfinfo.data.transfer.flutterChargeResponseCode,
                      'responseMsg': trfinfo.data.transfer.flutterChargeResponseMessage,
                      'bankCode': trfinfo.data.transfer.account.bankCode,
                      'accountNumber': trfinfo.data.transfer.account.accountNumber,
                      'accountName': trfinfo.data.transfer.account.accountName,
                      'payStatus': 'PENDING VALIDATION',
                      amountCharged: trfinfo.data.transfer.netDebitAmount,
                      medium: trfinfo.data.transfer.medium,
                      ipAddress: trfinfo.data.transfer.ip,
                    }

                    Payment.findByIdAndUpdate(paystat._id, newPayUpdate, function (err, newupdatepay) {
                      if (err) { return res.status(500).json({ status: "error", message: "Problem updating payment Info" }); }
                      if (newupdatepay) //{ return res.status(200).json({ status: "success", message: " Update Successful", data: newupdatepay }); }
                      return res.status(200).json({ 
                        status: "success", 
                        message: "transaction Successful, Pending Final Validation -  Redirecting ..." 
                      });
                    })

                    
                  }
                })

              }

            })
          }
        })
      }
    })
};



/**
 * Redirect Url to verify Payment and Update Db
 * @param {*} req
 * @param {*} res
 */
exports.updatePayStatus = function (req, res){
  Payment.findByIdAndUpdate(req.params.payId,
     { $set :{payStatus : 'Completed',responseMsg : 'Transaction Successful' }},{new:true},  
     function(err, finalupdate){
    if (err) { return res.status(500).json({status:"error", message:"Problem updating payment status"});}
    if (finalupdate) { return res.status(200).json({status:"success", message:"Final Update Successful", data:finalupdate});}
  })
}

/**
 * Redirect Url to confirm Payment OTP
 *@param {JSON:{otp}}
 *@param
 */

exports.confirmPayment = function (req, res){
  Payment.findById(req.params.payId, function(err, userPay){
    if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
    if (userPay){
      let body = {
        'transactionRef' : userPay.uniqueRef,
        'authType': 'OTP',
        'authValue': req.body.otp
      }
      moneywave.AccountToWallet.validate(body, function(err, valid){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
         if(valid) {
          Payment.findByIdAndUpdate(userPay._id,
            { $set :{payStatus : 'Completed',responseMsg : 'Transaction Successful' }},{new:true},  
            function(err, finalupdate){
           if (err) { return res.status(500).json({status:"error", message:"Problem updating payment status"});}
           if (finalupdate) { return res.status(200).json({status:"success", message:"Final Update Successful", data:finalupdate});}
         })
         }
      })
    }
  })
  
}

/**
 * Redirect Url for Card Payment
 *@param {JSON:{otp}}
 *@param
 */
exports.confirmCardPayment = function (req, res){
  
  Payment.findById(req.params.payId, function(err, userPay){
    
    if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
    if (userPay.chargeMethod === 'PIN'){
      let body = {
        'transactionRef' : userPay.uniqueRef,
        'otp': req.body.otp
      }
      moneywave.CardToAccount.validate(body, function(err, valid){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
        if(valid) {
          Payment.findByIdAndUpdate(userPay._id,
            { $set :{payStatus : 'Completed',responseMsg : 'Transaction Successful' }},{new:true},  
            function(err, finalupdate){
           if (err) { return res.status(500).json({status:"error", message:"Problem updating payment status"});}
           if (finalupdate) { return res.status(200).json({status:"success", message:"Final Update Successful", data:finalupdate});}
         })
         }


      })
    }else  if(userPay.chargeMethod === 'VBVSECURECODE'){
      Payment.findByIdAndUpdate(req.params.payId,
        { $set :{payStatus : 'Completed',responseMsg : 'Transaction Successful' }},{new:true},  
        function(err, finalupdate){
       if (err) { return res.status(500).json({status:"error", message:"Problem updating payment status"});}
       if (finalupdate) { return res.status(200).json({status:"success", message:"Final Update Successful", data:finalupdate});}
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
        let creator      = req.body.requestedBy
            ,sessionName = req.body.patient + "::" + selectedConsultant.username
            ,members     = [user._id, selectedConsultant._id]
            ,private     = true

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

            let creator      = req.body.requestedBy
                ,sessionName = prevSession.name
                ,members     = [patient, consultant]
                ,private     = true

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
 * @param {Request} req {id,requestedBy,consultationType}
 * @param {Response} res JSON
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
