
    const mongoose = require('mongoose')
    const User = mongoose.model('User')
    const emailer = require('../../config/mailer')
    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcryptjs');
    const config = require('../../config');
    const verifyToken = require('./verifyToken');
    const uuidv4 = require('uuid/v4');
    const uuidv3 = require('uuid/v3');
    const {CREATE_USER} = require('../../services/pusherService');
   // this.mailer = mailer;
   

//Login Method
exports.login = function (req, res){
    let loginUser = new User (req.body);
    
    User.findOne({ email: loginUser.email}, function(err, user){
        if (err) return res.status(500).json({status:"error", message:"DB_ERROR"});
        if (!user) return res.status(401).json({status:"error", message:"Invalid User"});
        
        let passwordIsValid = bcrypt.compareSync( loginUser.password, user.password)
             if (!passwordIsValid) return res.status(401).json({ auth: false, token: null})
        //create a token
        let token = jwt.sign({ id: user._id}, config.app.secret, {
            expiresIn: 3600 // expires in 1hour
        })
        res.status(200).json({status:"success", auth: true, token: token });
    });
    
};
    //Logout Method
exports.logout = function (){
    res.status(200).json({status:"success", auth: false, token: null });
};

// Get logged in User with token
exports.signedHeader = (function (req, res){
    let myUser 
    
   User.findById(userId,{ password:0 }, function (err, user) {
         if (err) return res.status(500).json({status:"error", message: "There was a problem finding the user."});
         if (!user) return res.status(404).json({status:"error", message:"No user found."});
         
         res.status(200).json({ status:"success", auth:true, message:"User authorized" });
         myUser = user.id;
         
     });
      loggedUser = myUser
       
     });
 
 //Sign Up/Register Method
 exports.register = function (req, res){
    if (req.body.accountType === 'patient')
    {
      User.schema.add({'accountType':{type:String}});
      User.schema.add({'payments':[{type: Schema.Types.ObjectId, ref:'paymentModel'}]});
      let newUser = new User (req.body);
      let hashedPassword = bcrypt.hashSync(newUser.password, 8);
  
      if (!newUser) return res.status(400).json({status:"error", message:"Empty or Incomplete Parameters for New User "});
      
      User.findOne ({ email : newUser.email }, function(err, user){
         if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
         if (user) return res.status(401).json({status:"error", message:"Email already exist"}); 
         newUser.password = hashedPassword
        
         newUser.save( function (err, user){
          if (err) return res.status(500).json({status:"error", message:"There was a problem adding the info to the DB"});
          
           //create a token
           let token = jwt.sign({ id : user._id }, config.app.secret, {
            expiresIn: 86400 // expires in 24hours
        })
        CREATE_USER(user._id, function(res, err){
            
        })
        res.status(200).json({status:"success", message:"Users added successfully",data:user});
      })
      
   });
  } else if (req.body.accountType === 'consultant'){
      User.schema.add({'accountType':{type:String}});
      User.schema.add({'balance':{type:String}});
      User.schema.add({'speciality':{type:String}});
      User.schema.add({'folioNumber':{type:String}});
      User.schema.add({'yofPractice':{type:String}});
      User.schema.add({'currentJob':{type:String}});

      let newUser = new User (req.body);
      let hashedPassword = bcrypt.hashSync(newUser.password, 8);
      if (!newUser) return res.status(400).json({status:"error", message:"Empty or Incomplete Parameters for New User "});
      
      User.findOne ({ email : newUser.email }, function(err, user){
         if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
         if (user) return res.status(401).json({status:"error", message:"Email already exist"}); 
         
         newUser.password = hashedPassword;
         newUser.balance = 0;
         newUser.save( function (err, user){
          if (err) return res.status(500).json({status:"error", message:"There was a problem adding the info to the DB"});
          
           //create a token
           let token = jwt.sign({ id : user._id }, config.app.secret, {
            expiresIn: 86400 // expires in 24hours
        })
        res.status(200).json({status:"success", message:"Users added successfully",data:user});
      })
      
   });
  } else return res.status(500).json({status:"error", message:"DB ERROR"});
  };

/**
 * PASSWORD RESET
 * req | res
 */
exports.resetPassword = function (req, res){
    let emailUser = new User (req.body)

    User.findOne({ email: emailUser.email }, function(err, user) {
        if (err) return res.status(500).json({status:"error", message:"DB_ERROR"});
        if (!user) return res.status(401).json({status:"error", message:"Email does not exist"});
        
            let passwordResetHash = uuidv4();
            let passLink = 'http://localhost:3000/confirmresetpassword/'+passwordResetHash
            let mailtext = "We received your request for a password reset on your HealthPeer Account. <br> Click on the link  below to setup a new password <br>"+ passLink
            let token = jwt.sign({ iat : new Date().getTime() / 1000 }, passwordResetHash, {
                expiresIn: 3600 // expires in 1H
            })
            //mail options
            emailer.mailOptions.to = user.email;
            emailer.mailOptions.html =  mailtext 

            //send reset mail
            emailer.transporter.sendMail(emailer.mailOptions, function (err, info) {
                if(err) { console.log(err) }
                else {
                    User.findByIdAndUpdate( user._id, { 
                      $set: { 
                        passwordResetKey: { passHash : passwordResetHash, token:token }
                      }
                    }, function(err, user){
                        if (err) {
                          return res.status(500).json({status:"error", message:"DB_ERROR"});

                        }else {
                          return res.status(200).json({ 
                              status:"success", 
                              auth:true, 
                              message:"password Reset Key updated" 
                            });
                        }       
                    })
                }
             });         
    });
};
//confirm password reset token
exports.signedPassReset = function (req, res){
    
    User.findOne({ "passwordResetKey.passHash" : req.params.resetkey},function(err, user){
        
        let token = user.passwordResetKey.token
        
    if (!token) return res.status(401).json({ status:"error", auth: false, message: 'No token provided.' })
    
    jwt.verify(token, user.passwordResetKey.passHash, function(err, ){
        if (err) return res.status(500).json({status:"error", auth: false, message: 'No Authorization: Failed to authenticate token.' });
            
            res.status(200).json({status:"success", message:"User Authorized",auth:true});
        
        });
    });
};
//Password Reset Final Procedure
exports.resetPasswordFinal = function (req, res){
        let userPassword = new User(req.body)

        let hashedPassword = bcrypt.hashSync(userPassword.password, 8);
   User.findOne({ "passwordResetKey.passHash" : req.params.resetkey},function(err, user){
    if (err) return res.status(500).json({status:"error", message:"DB_ERROR"});
    if (!user) return res.status(401).json({status:"error", message:"Request a new password reset link to continue"});

    let token = user.passwordResetKey.token
    jwt.verify(token, user.passwordResetKey.passHash, function(err,decoded){
        if (err) return res.status(500).json({status:"error", auth: false, message: 'No Authorization: Failed to authenticate token.' });
    
    User.findByIdAndUpdate( user._id,{ $set: {password : hashedPassword}}, function(err, user){
        if (err) return res.status(500).json({status:"error", message:"DB_ERROR"});
        res.status(200).json({status:"success", message:"password Successfully updated", auth:true});
    });
});
});
};



