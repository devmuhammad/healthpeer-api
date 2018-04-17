var mongoose = require('mongoose')
User = mongoose.model('User')
this.ApiResponse = require('../models/api-response.js');
this.ApiMessages = require('../models/api-messages.js');
this.UserProfileModel = require('../models/userprofile.js');



//Create New User Method
exports.list_all_tasks = function(req, res) {
Task.find({}, function(err, task) {
  if (err)
    res.send(err);
  res.json(task);
});
};

exports.createUser = function (req, res){

User.findOne({ email: newUser.email}, function (err, user){
    if (err) {
        res.send(err, new me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.DB_ERROR} }));
    }
    if (user){ 
        res.send(err, new me.ApiResponse({ success: false, extras:{msg:me.ApiMessages.EMAIL_ALREADY_EXISTS}}));
    }
    else {
        newUser.save( function (err, user, numberAffected){
            if (err) {
                return callback(err, me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.DB_ERROR} }));
            }
            if (numberAffected === 1) {
                var UserProfileModel = new me.UserProfileModel({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName
                });
            return callback(err, new me.ApiResponse({ success: true, extras:{UserProfileModel:UserProfileModel}}));
            }
            else {
                return callback(err, new me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.COULD_NOT_CREATE_USER}}));
            }
        });
    }
});
};

UserController.prototype.userslist = function (callback){
var me = this;

User.find({}, function(err,userlist){
    if (err) {
        return callback (err, me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.DB_ERROR}}));
    }
    if (userlist){

        var UserProfileModels = []

        userlist.forEach(function (user) {
            UserProfileModel = new userProfile ({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName

            });
            UserProfileModels.push(UserProfileModel)
        });
        return callback (err, new me.ApiResponse({ success:true, extras:{ UserProfileModels:UserProfileModels}}));
    }
})
};

UserController.prototype.userbyid = function (id, callback){
var me = this;

User.findById(id, function (err, user){
    if (err) {
        return callback (err, me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.DB_ERROR}}));
    }
    if (user) {
        return callback (err, me.ApiResponse({ success: true, extras:{
        UserProfileModel : new userProfile ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          })
        }
        }));
    }
    else {
        return callback (err, me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.NOT_FOUND}}));
}
});
};

UserController.prototype.updateuserProfile = function (userProfile, callback){
var me = this;

User.update({ email: userProfile.email},{}, function(err, numberAffected){
    if (err) {
        return callback (err, me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.DB_ERROR}}));
    }
    if (numberAffected < 1){
        return callback(err, new me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD} }));
        }
        else {
            return callback(err, new me.ApiResponse({ success: true, extras:null}));
        }
});
};

UserController.prototype.deleteUser = function (id, callback){
var me = this;

User.remove({_id:id}, function(err, numberAffected){
    if (err) {
        return callback (err, new me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.DB_ERROR}}));
    }
    if (numberAffected === 1){
        return callback (err, new me.ApiResponse({ success: true, extras:null}))
    }
});
}
 //Password Reset Method
 AccountController.prototype.resetPassword = function (email, callback){
    var me = this;
    me.userModel.findOne({ email: email },function(err, user){
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.DB_ERROR} }));
        }
        if (user) {
            var passwordResetHash = me.uuid.v4();
            me.session.passwordResetHash = passwordResetHash;
            me.session.emailWhoRequestedPasswordReset = email;

            me.mailer.sendPasswordResetHash(email, passwordResetHash)
            return callback(err, new me.ApiResponse({ success: true, extras:{ passwordResetHash : passwordResetHash}}));
        }
        else {
            return callback (err, new me.ApiResponse({ success: false, extras:{msg:me.ApiMessages.EMAIL_NOT_FOUND}}));
        }
    });
};

//Password Reset Final Procedure
AccountController.prototype.resetPasswordFinal = function (email,newPassword, passwordResetHash, callback){
var me = this;
if (!me.session || !me.session.passwordResetHash) {
    return callback (err, new me.ApiResponse({ success: false, extras:{msg:me.ApiMessages.PASSWORD_RESET_EXPIRED}}));
}
if (me.session.passwordResetHash !== passwordResetHash){
    return callback (err, new me.ApiResponse({ success: false, extras:{msg:me.ApiMessages.PASSWORD_RESET_HASH_MISMATCH}}));
}
if (me.session.emailWhoRequestedPasswordReset != email){
    return callback (err, new me.ApiResponse({ success: false, extras:{msg:me.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH}}));
}
if (me.session.passwordResetHash === passwordResetHash && me.session.emailWhoRequestedPasswordReset === email ){
    var passwordSalt = this.uuid.v4();

    me.hashPassword(newPassword, passwordSalt,function(err, passwordHash){

        me.userModel.update({ email: email },{ passwordHash: passwordHash, passwordSalt:passwordSalt }, function (err,numberAffected,raw){
            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.DB_ERROR} }));
            }
            if (numberAffected < 1){
                return callback(err, new me.ApiResponse({ success: false, extras:{msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD} }));
            }
            else {
                return callback(err, new me.ApiResponse({ success: true, extras:null}));
            }
        })
    })
}
}
AccountController.prototype.getSession = function (){
    return this.session;
};

AccountController.prototype.setSession = function (){
     this.session = session
};

AccountController.prototype.hashPassword = function (password, salt, callback){
// we use pbkdf2 to hash and iterate 10k times by default 
var iterations = 10000,
keyLen = 64; // 64 bit.
this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
};

//Login Method
exports.login = function (req, res){
    
    Auth.findOne({ email: email}, function(err, user){
        if (err) 
            return res.status(500).send('DB_ERROR');
        
        if (user && user.passwordSalt){

            me.hashPassword(password, user.passwordSalt, function (err, passwordHash){
                if ( passwordHash == user.passwordHash){
                    var UserProfileModel = new me.UserProfileModel({
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    });
                    // Save to http session.

                    me.session.UserProfileModel = UserProfileModel;
                    me.session.id = me.uuid.v4();

                    // Save to persistent session.
                    me.userSession.userId = user._id;
                    me.userSession.sessionId = me.session.id

                    me.userSession.save(function (err,sessionData, numberAffected){
                        if (err) {
                            return callback(err, me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR}}));
                        }
                        if (numberAffected === 1) {
                            // Return the user profile so the router sends it to the client app doing the logon.
                            return callback (err, new me.ApiResponse({ success:true, extras: {UserProfileModel:UserProfileModel}}));
                        }
                        else {
                            return callback (err, me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_SESSION}}));
                        }
                    })
                    
                }
                else { return callback(err, new me.ApiResponse({ success:false, extras:{msg: me.ApiMessages.INVALID_PWD}}));
            }
            });
        } else  {
            return callback(err, new me.ApiResponse({success:false, extras:{msg: me.ApiMessages.EMAIL_NOT_FOUND}}));
        }

    });

    //Logout Method
AccountController.prototype.logout = function (){
    if (this.session.UserProfileModel) delete this.session.UserProfileModel;
    return;
};
}