    const mongoose = require('mongoose')
    User = require('../models').user
    medicalInfo =  require('../models').medicalInfo
    consultHistory =  require('../models').consultationHistory
    var verifyToken = require('../middleware/verifyToken');
    var fs = require('fs')
    
    
 exports.userslist = function (req, res){
   
    User.find().populate("payments").exec( function(err, user) {
       if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
       if (!user) return res.status(401).json({status:"error", message:"No User found"}); 
        res.status(200).json({status:"success", message:"Users",data:user});
      });
    };
  
 exports.userbyid = (function (req, res){
    User.findById(req.params.userId).populate("payments").exec (function (err, user){

      if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
      if (!user) return res.status(401).json({status:"error", message:"No User found"});
        res.status(200).json({status:"success", message:"User found",data:user});
           
      });
    });

    exports.saveImage = function (req, res){
      let userId = res.locals.myId
      let imgFile = res.locals.imgfile
    
      User.findById(userId, function(err, user){
        if (err) return res.status(500).json({status:"error", message:"There was a problem Finding user "});
        if (!user) return res.status(404).json({status:"error", message:"user not found"});

        // if (user.userImg){
        //   // let newImage = new User(imgFile)
          
        //   let userImg = {};
        //   userImg['path'] = imgFile[0].path;
        //   userImg['originalname'] = imgFile[0].originalname;
        //   User.findByIdAndUpdate()
        // }
        if (user) {
          // let path = imgFile[0].path;
          // let imageName = imgFile[0].originalname;    
          let newImage = new User(imgFile)

          // let userImg = {};
          newImage.userImg['path'] = imgFile[0].path;
          newImage.userImg['originalname'] = imgFile[0].originalname;

          // newImage.userImg.data = fs.readFileSync(updtUser.data)
          // newImage.userImg.contentType = 'image/png';
          newImage.save( function(err,nwImage){
            if (err) return res.status(500).json({status:"error", message:"There was a problem Updating user Image "});

            if (nwImage){
              
              res.status(200).json({status:"success", message:"user Image updated successfully",data:nwImage});
            }
          })
        }
    })
    };

 exports.updateuserProfile = function (req, res){
  let updtUser = req.body
    User.findById(updtUser.id, function(err, user){
      if (err) return res.status(500).json({status:"error", message:"There was a problem Updating user "});
      if (!user) return res.status(404).json({status:"error", message:"user not found"});
      
       if(user){
        User.findByIdAndUpdate( user._id, req.body, {new:true}, function(err,user){
          
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
    
   newMedInfo = req.body
   let loggedInUser = newMedInfo.id
   
   User.findById(loggedInUser, function(err, usermed) {
    if (err) return res.status(500).json({status:"error", message:"DB find ERROR "});
    if (!usermed) return res.status(500).json({status:"error", message:"User Not found "});
    
      User.findByIdAndUpdate(loggedInUser,
         { $set : { medicalInfo : { 
           bp :newMedInfo.bp,
           bloodGroup:newMedInfo.bloodGroup,
           genotype:newMedInfo.genotype,
           weight:newMedInfo.weight,
           height:newMedInfo.height
          }
        }
      },{new:true, strict:true}, function(err,usermedupdate){
        if (err) return res.status(500).json({status:"error", message:"DB update ERROR "});

        res.status(200).json({ status: "success", auth:true, message:"Medical Information Updated",data:usermedupdate});
      });
    
//    else if (!usermed.medicalInfo){
//   newMedInfo.save( function(err,medInfo){ 
//     if (err) return res.status(500).json({status:"error", message:"There was a problem saving the info "});
//     User.findByIdAndUpdate(loggedInUser,newMedInfo,{new:true}, function(err,user){
//       if (err) return res.status(500).json({status:"error", message:"There was a problem updating the info"});
//       res.status(200).json({ status:"success", auth:true, message:"Medical Information Updated",data:user});
    
//     });
    
//   });
// }
});

});
