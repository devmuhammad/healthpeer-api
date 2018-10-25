var  multer = require('multer');
    
    var storage = multer.diskStorage({
      destination: function(req, file, cb) {
      cb(null, 'uploads/')
      },
      filename: function(req, file, cb) {
      cb(null, file.originalname);
      }
     });
      
     var upload = multer({
      storage: storage
     });


      function imageUploader (req, res, next) {
        
        upload.any();

        res.locals.imgfile = req.file
        

        next()
      }
      module.exports = imageUploader;