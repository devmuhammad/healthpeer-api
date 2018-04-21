    var mongoose = require('mongoose')
    User = mongoose.model('User')
    medicalInfo = mongoose.model('medicalInfo')
    consultHistory = mongoose.model('consultHistory')
    var verifyToken = require('./verifyToken');
    
    
 exports.userslist = function (req, res){
   
    User.find().populate("medicalInfo").exec( function(err, user) {
       if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
       if (!user) return res.status(401).json({status:"error", message:"No User found"}); 
        res.status(200).json({status:"success", message:"Users",data:user});
      });
    };
  
 exports.userbyid = (function (req, res){
    User.findById(req.params.userId, function (err, user){

      if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
      if (!user) return res.status(401).json({status:"error", message:"No User found"});
        res.status(200).json({status:"success", message:"User found",data:user});
           
      });
    });

 exports.updateuserProfile = function (req, res){
    let updtUser = new User(req.body) 
    User.findById(updtUser.id, function(err, user){
      if (err) return res.status(500).json({status:"error", message:"There was a problem Updating user "});
      if (!user) return res.status(404).json({status:"error", message:"user not found"});
      
      if (user.accountType === 'consultant'){
        User.schema.add({'speciality':{type:String}});
        User.schema.add({'folioNumber':{type:String}});
        User.schema.add({'yofPractice':{type:String}});
        User.schema.add({'currentJob':{type:String}});
        User.schema.add({'accountType':{type:String}});
        
        User.findByIdAndUpdate( user._id, req.body, {new:true}, function(err,user){

          if (err) return res.status(500).json({status:"error", message:"There was a problem Updating user "});
          
          res.status(200).json({status:"success", message:"user updated successfully",data:user});
        });
      } if(user.accountType === 'patient'){
        User.findAndUpdate( req.params.userId, req.body, {new:true}, function(err,user){

          if (err) return res.status(500).json({status:"error", message:"There was a problem Updating user "});
          
          res.status(200).json({status:"success", message:"user updated successfully",data:user});
      })
    }
    
    });
  };

 exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.userId, function(err, user){
      if (err) return res.status(500).json({status:"error", message:"There was a problem deleting User "});
      
    res.status(200).json({status: "success", message: 'User successfully deleted' });
  });
};

exports.updateMedInfo = (function (req, res){
    var loggedInUser = userId
   newMedInfo = new medicalInfo(req.body) 

   User.findById(loggedInUser, function(err, usermed) {
    if (err) return res.status(500).json({status:"error", message:"DB find ERROR "});
    
    if (usermed.medicalInfo) {
      newMedInfo._id = usermed.medicalInfo
      
      medicalInfo.findByIdAndUpdate(usermed.medicalInfo, newMedInfo,{new:true}, function(err,usermedupdate){
        if (err) return res.status(500).json({status:"error", message:"DB update ERROR "});

        res.status(200).json({ status: "success", auth:true, message:"Medical Information Updated",data:usermedupdate});
      });
    }
   else if (!usermed.medicalInfo){
  newMedInfo.save( function(err,medInfo){
    if (err) return res.status(500).json({status:"error", message:"There was a problem saving the info "});
    User.findByIdAndUpdate(loggedInUser,{ $set :{medicalInfo : medInfo._id}},{new:true}, function(err,user){
      if (err) return res.status(500).json({status:"error", message:"There was a problem updating the info"});
      res.status(200).json({ status:"success", auth:true, message:"Medical Information Updated",data:user});
    
    });
    
  });
}
});

});
