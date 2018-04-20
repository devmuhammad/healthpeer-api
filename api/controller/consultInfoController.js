var mongoose = require('mongoose')

consultantInfo = mongoose.model('consultantInfo')


exports.createConsultant = function (req, res){

    var newConsultant = new consultantInfo (req.body);
    if (!newConsultant) return res.status(400).json({status:"error", message:"Empty or Incomplete Parameters for New Consultant "});
    
    consultantInfo.findOne ({ email : newConsultant.email }, function(err, consultant){
       if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
       if (consultant) return res.status(401).json({status:"error", message:"Email already exist"}); 
       
       newConsultant.save( function (err, consultant){
        if (err) return res.status(500).json({status:"error", message:"There was a problem adding the info to the DB"});
        
      res.status(200).json({status:"success", message:"Consultants added successfully",data:consultant});
    })
 });
};

exports.consultantslist = function (req, res){
consultantInfo.find().populate("medicalInfo").exec( function(err, consultant) {
    if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
    if (!consultant) return res.status(401).json({status:"error", message:"No Consultant found"}); 
     res.status(200).json({status:"success", message:"Consultants",data:consultant});
   });
 };

exports.consultantbyid = (function (req, res){
 consultantInfo.findById(req.params.consultantId, function (err, consultant){

   if (err) return res.status(500).json({status:"error", message:"DB ERROR"});
   if (!consultant) return res.status(401).json({status:"error", message:"No consultant found"});
     res.status(200).json({status:"success", message:"consultant found",data:consultant});
        
   });
 });
 exports.updateconsultantProfile = function (req, res){
    consultantInfo.findByIdAndUpdate( req.params.consultantId, req.body, {new:true}, function(err,consultant){

      if (err) return res.status(500).json({status:"error", message:"There was a problem Updating consultant "});
      
      res.status(200).json({status:"success", message:"consultant updated successfully",data:consultant});
    });
  };

  exports.deleteConsultant = (req, res) => {
    consultantInfo.findByIdAndRemove(req.params.consultantId, function(err, consultant){
      if (err) return res.status(500).json({status:"error", message:"There was a problem deleting consultant "});
      
    res.status(200).json({status: "success", message: 'consultant successfully deleted' });
  });
};