const app         = require('express')()
      ,mongoose   = require('mongoose')
      ,config     = require('./config')
      ,dbConfig   = require('./config/database.config')
      ,bodyParser = require('body-parser')
      ,User       = require('./api/models/userModel')
      ,medicalInfo = require('./api/models/medicalInfoModel')
      ,consultHistory = require('./api/models/consultHistoryModel')
      ,consultInfo = require('./api/models/consultInfoModel')
      ,userRouter = require('./api/routes/userRoute')  //import routes
      ,authRouter = require('./api/routes/authRoute')
      ,middleware = require('./api/controller/verifyToken');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());      
      
// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
  keepAlive: true,
  reconnectTries: 30,
})
.then(() => {
  //monitor connection    
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.on('open', () => { console.log(`Connected to db at ${dbConfig.url}`); }); 
  console.log("Moh's connection")

}).catch(err => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
      
//app.use(middleware)
// Routes
app.use("/user", userRouter);
app.use("/auth", authRouter);


app.listen(config.app.port);
console.log("App running on port "+config.app.port);
