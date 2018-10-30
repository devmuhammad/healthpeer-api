    const mongoose = require('mongoose')
    User = require('../models').user
    medicalInfo =  require('../models').medicalInfo
    consultHistory =  require('../models').consultationHistory
    var verifyToken = require('../middleware/verifyToken');
    var fs = require('fs')
    const  multer = require('multer')
    const cloudinary = require('cloudinary')
    const cdConfig      = require('../../config/cloudinary');
    const imgFile = ""

cloudinary.config({
  cloud_name: 'healthpeer-api',
  api_key: cdConfig.CLOUDINARY_API_KEY,
  api_secret: cdConfig.CLOUDINARY_API_SECRET,
});

 function imageUploader (req, res, next) {

  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
    cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
    cb(null, file.originalname);
    }
   });
    
  var upload = multer()
  //    {
  //   storage: storage
  //  });
  
  upload.single('photo');
  // res.json(req.file)

  console.log(req.file)
  imgFile = req.file
  }

    
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

    // Get logged in User with token
exports.signedHeader = (function (req, res){
  let userId = res.locals.myId
    
  User.findById(userId,{ password:0 }, function (err, user) {
        if (err) return res.status(500).json({status:"error", message: "There was a problem finding the user."});
        if (!user) return res.status(404).json({status:"error", message:"No user found."});
        
        res.status(200).json({ status:"success", auth:true, message:"User authorized", data: user });
        
        
    });
     
      
    });

    exports.saveImage = function async (req, res){
      let userId = res.locals.myId
      
      
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
         await imageUploader(req)

          const newPhoto = imgFile['photo'].data.toString('base64');
          const type = imgFile['photo'].mimetype;   
          

          cloudinary.v2.uploader.upload(`data:${type};base64,${newPhoto}`, (err, photo) => {
            if (err) {
              console.error(err);
              res.status(400).send(err);
            } else {
              const photoUrl = photo.url;

              let newImage = new User(imgFile)
          // let userImg = {};
          newImage.userImg['path'] = photoUrl;
          newImage.userImg['originalname'] = imgFile['photo'].name;

          // newImage.userImg.data = fs.readFileSync(updtUser.data)
          // newImage.userImg.contentType = 'image/png';
          newImage.save( function(err,nwImage){
            if (err) return res.status(500).json({status:"error", message:"There was a problem Updating user Image "});

            if (nwImage){
              
              res.status(200).json({status:"success", message:"user Image updated successfully",data:nwImage});
            }
          })
        }
      });
        
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
