    var mongoose = require('mongoose')
    User = mongoose.model('User')
    medicalInfo = mongoose.model('medicalInfo')
    consultHistory = mongoose.model('consultHistory')
    var verifyToken = require('./verifyToken');
    

 //Create New User Method

 exports.createUser = function (req, res){

    var newUser = new User (req.body);
    if (!newUser) return res.status(400).send("Empty or Incomplete Parameters for New User ");
    
    User.findOne ({ email : newUser.email }, function(err, user){
       if (err) return res.status(500).send("DB ERROR");
       if (user) return res.status(401).send("Email already exist"); 
       
       newUser.save( function (err, user){
        if (err) return res.status(500).send("There was a problem adding the info to the DB");
        
      res.status(200).json(user);
    })
 });
};
    
 exports.userslist = function (req, res){
   
    User.find().populate("medicalInfo").exec( function(err, user) {
       if (err) return res.status(500).send("DB ERROR");
       if (!user) return res.status(401).send("No User in DB"); 
        res.status(200).json(user);
      });
    };

    
 exports.userbyid = (function (req, res){
    User.findById(req.params.userId, function (err, user){

      if (err) return res.status(500).send("DB ERROR");
      if (!user) return res.status(401).send("No User found");
        res.status(200).json(user);
        
        
      });
    });

 exports.updateuserProfile = function (req, res){
    User.findByIdAndUpdate( req.params.userId, req.body, {new:true}, function(err,user){

      if (err) return res.status(500).send("There was a problem Updating User ");
      
      res.status(200).json(user);
    });
  };

 exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.userId, function(err, user){
      if (err) return res.status(500).send("There was a problem deleting User ");
      
    res.status(200).json({status: "success", message: 'User successfully deleted' });
  });
};
exports.updateMedInfo = (function (req, res){
    var loggedInUser = userId
   newMedInfo = new medicalInfo(req.body) 

   User.findById(loggedInUser, function(err, usermed) {
    if (err) return res.status(500).send("DB ERROR ");
    if (usermed.medicalInfo) {
      medicalInfo.findByIdAndUpdate(usermed.medicalInfo, newMedInfo,{new:true}, function(err,usermedupdate){
        if (err) return res.status(500).send("DB ERROR ");
        res.status(200).json({ auth:true, message:"Medical Information Updated",usermedupdate});
      });
    }
   else if (!usermed.medicalInfo){
  newMedInfo.save( function(err,medInfo){
    if (err) return res.status(500).send("There was a problem saving the info ");
    User.findByIdAndUpdate(loggedInUser,{ $set :{medicalInfo : medInfo._id}},{new:true}, function(err,user){
      if (err) return res.status(500).send("There was a problem updating the info ");
      res.status(200).json({ auth:true, message:"Medical Information Updated",user});
    
    });
    
  });
}
});

});
