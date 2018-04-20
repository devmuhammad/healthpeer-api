    var mongoose = require('mongoose')
    User = mongoose.model('User')
    medicalInfo = mongoose.model('medicalInfo')
    consultHistory = mongoose.model('consultHistory')
    var verifyToken = require('./verifyToken');
    

 //Create New User Method

 exports.createUser = function (req, res){

    var newUser = new User (req.body);
    if (!newUser) return res.status(400).json({status:"error", message:"Empty or Incomplete Parameters for New User "});
    
    User.findOne ({ email : newUser.email }, function(err, user){
       if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
       if (user) return res.status(401).json({status:"error", message:"Email already exist"}); 
       
       newUser.save( function (err, user){
        if (err) return res.status(500).json({status:"error", message:"There was a problem adding the info to the DB"});
        
      res.status(200).json({status:"success", message:"Users added successfully",data:user});
    })
 });
};
    
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
    User.findByIdAndUpdate( req.params.userId, req.body, {new:true}, function(err,user){

      if (err) return res.status(500).json({status:"error", message:"There was a problem Updating user "});
      
      res.status(200).json({status:"success", message:"user updated successfully",data:user});
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
    if (err) return res.status(500).json({status:"error", message:"DB ERROR "});
    if (usermed.medicalInfo) {
      medicalInfo.findByIdAndUpdate(usermed.medicalInfo, newMedInfo,{new:true}, function(err,usermedupdate){
        if (err) return res.status(500).json({status:"error", message:"DB ERROR "});
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
