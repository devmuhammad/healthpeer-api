const app     = require('express')(),
      config = require('./config');
      dbConfig = require('./config/database.config')
      bodyParser = require('body-parser');
      
      User = require('./api/models/userModel');
      
      

//Import the mongoose module
var mongoose = require('mongoose');
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

//Set up default mongoose connection
mongoose.connect(dbConfig.url)
      .then(() =>{
            console.log("Successfully connected to the database"); 
      }).catch(err => {
            console.log('Could not connect to the database. Exiting now...');
            process.exit();
        });
      
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

      require ('./api/routes/userRoute')(app)  //import user route
      require ('./api/routes/authRoute')(app) //import authentication route
 

app.listen(config.app.port);
console.log("App running on port "+config.app.port);