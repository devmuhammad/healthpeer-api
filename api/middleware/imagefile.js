const  multer = require('multer');


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
        res.locals.imgfile = req.file
        

        next()
      }
      module.exports = imageUploader;