    var mongoose = require('mongoose')
    User = mongoose.model('User')
    

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
   
    User.find({}, function(err, user) {
       if (err) return res.status(500).send("DB ERROR");
       if (!user) return res.status(401).send("No User in DB"); 
        res.status(200).json(user);
      });
    };

    
 exports.userbyid = function (req, res){
    User.findById(req.params.userId, function (err, user){

      if (err) return res.status(500).send("DB ERROR");
      if (!user) return res.status(401).send("No User found");
        res.status(200).json(user);
      });
    };

 exports.updateuserProfile = function (req, res){
    User.findByIdAndUpdate( req.params.userId, req.body, {new:true}, function(err,user){

      if (err) return res.status(500).send("There was a problem Updating User ");
      
      res.status(200).json(user);
    });
  };

 exports.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.userId, function(err, user){
      if (err) return res.status(500).send("There was a problem deleting User ");
      
    res.status(200).json({ message: 'User "+ user.firstname +" "+ +" "+ user.lastname +"  successfully deleted' });
  });
};
