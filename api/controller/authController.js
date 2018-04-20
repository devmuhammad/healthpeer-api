
    var mongoose = require('mongoose')
    User = mongoose.model('User')
    var emailer = require('../../config/mailer')
    var jwt = require('jsonwebtoken');
    var bcrypt = require('bcryptjs');
    var config = require('../../config');
    var verifyToken = require('./verifyToken');
    const uuidv4 = require('uuid/v4');
    const uuidv3 = require('uuid/v3');
    
   // this.mailer = mailer;
   

//Login Method
exports.login = function (req, res){
    var loginUser = new User (req.body);
    
    User.findOne({ email: loginUser.email}, function(err, user){
        if (err) return res.status(500).send('DB Error');
        if (!user) return res.status(401).send('User does not exist');
        
        var passwordIsValid = bcrypt.compareSync( loginUser.password, user.password)
             if (!passwordIsValid) return res.status(401).send({ auth: false, token: null})
        //create a token
        var token = jwt.sign({ id: user._id}, config.secret, {
            expiresIn: 3600 // expires in 1hour
        })
        res.status(200).send({ auth: true, token: token });
    });
    
};
    //Logout Method
exports.logout = function (){
    res.status(200).send({ auth: false, token: null });
};

// Get logged in User with token
exports.signedHeader = (function (req, res){
    var myUser 
    
   User.findById(userId,{ password:0 }, function (err, user) {
         if (err) return res.status(500).send({message: "There was a problem finding the user."});
         if (!user) return res.status(404).send({message:"No user found."});
         
         res.status(200).send({ auth:true, message:"User authorized" });
         myUser = user.id;
         
     });
      loggedUser = myUser
       
     });
 
 //Sign Up/Register Method
exports.register = function (req, res) {
    var newUser = new User (req.body);
    //console.log(newUser)
    var hashedPassword = bcrypt.hashSync(newUser.password, 8);

    User.findOne({ email: newUser.email}, function (err, user){
        if (err) return res.status(500).send('DB_ERROR');
        if (user) return res.status(401).send("Email already exist");
        
        newUser.password = hashedPassword
        
            newUser.save( function (err, user){
                
            if (err) return res.status(500).send("There was a problem registering the User");
            //create a token
            var token = jwt.sign({ id : user._id }, config.secret, {
                expiresIn: 86400 // expires in 24hours
            })
            res.status(200).send({ auth:true, token: token });
    });
});
};

exports.resetPassword = function (req, res){
    var emailUser = new User (req.body)

    User.findOne({ email: emailUser.email },function(err, user){
        if (err) return res.status(500).send('DB_ERROR');
        if (!user) return res.status(401).send("Email does not exist");
        
         
            var passwordResetHash = uuidv4();
            
            var passLink = 'http://localhost:3000/confirmresetpassword/'+passwordResetHash
            var mailtext = "We received your request for a password reset on your HealthPeer Account. <br> Click on the link  below to setup a new password <br>"+ passLink
            var token = jwt.sign({ iat : new Date().getTime() / 1000 }, passwordResetHash, {
                expiresIn: 3600 // expires in 1H
            })
            emailer.mailOptions.to = user.email;
            emailer.mailOptions.html =  mailtext 
            emailer.transporter.sendMail(emailer.mailOptions, function (err, info) {
                if(err)
                  console.log(err)
                else
                console.log(info);
                User.findByIdAndUpdate( user._id,{ $set: {passwordResetKey:{passHash : passwordResetHash, token:token }}}, function(err, user){
                    if (err) return res.status(500).send('DB_ERROR');
                     
                    
            res.status(200).send({ auth:true, message:"password Reset Key updated" });
                    
                })
                  
             });
              
    });
};
//confirm password reset token
exports.signedPassReset = function (req, res){
    
    User.findOne({ "passwordResetKey.passHash" : req.params.resetkey},function(err, user){
        
        var token = user.passwordResetKey.token
        
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
    
    jwt.verify(token, user.passwordResetKey.passHash, function(err, ){
        if (err) return res.status(500).send({ auth: false, message: 'No Authorization: Failed to authenticate token.' });
            
            res.status(200).send({auth:true});
        
        });
    });
};
//Password Reset Final Procedure
exports.resetPasswordFinal = function (req, res){
        var userPassword = new User(req.body)

        var hashedPassword = bcrypt.hashSync(userPassword.password, 8);
   User.findOne({ "passwordResetKey.passHash" : req.params.resetkey},function(err, user){
    if (err) return res.status(500).send('DB_ERROR');
    if (!user) return res.status(401).send("Request a new password reset link to continue");

    var token = user.passwordResetKey.token
    jwt.verify(token, user.passwordResetKey.passHash, function(err,decoded){
        if (err) return res.status(500).send({ auth: false, message: 'No Authorization: Failed to authenticate token.' });
    
    User.findByIdAndUpdate( user._id,{ $set: {password : hashedPassword}}, function(err, user){
        if (err) return res.status(500).send('DB_ERROR');
        res.status(200).send({message:"password Successfully updated", auth:true});
    });
});
});
};



