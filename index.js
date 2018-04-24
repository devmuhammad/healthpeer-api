const app         = require('express')()
      ,mongoose   = require('mongoose')
      ,config     = require('./config')
      ,dbConfig   = require('./config/database.config')
      ,bodyParser = require('body-parser')
      ,User       = require('./api/models/userModel')       //import Models
      ,medicalInfo = require('./api/models/medicalInfoModel')
      ,consultHistory = require('./api/models/consultHistoryModel')
      ,payment    = require('./api/models/paymentModel')
      ,consultantTransaction = require('./api/models/transactionModel')
      ,session  = require('./api/models/session')
      ,bloodBank = require('./api/models/bloodBank')
      ,userRouter = require('./api/routes/userRoute')         //import routes
      ,authRouter = require('./api/routes/authRoute')
      ,paymentRoute = require('./api/routes/paymentRoute')
      ,sessionRoute = require('./api/routes/session')
      ,middleware = require('./api/middleware/verifyToken')
      ,morgan = require('morgan')
      ,fs = require('fs')
      ,path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  

let httpLogStream = fs.createWriteStream(path.join(__dirname, 'httplogs.log'), {flags: 'a'})    
app.use(morgan('combined', {stream: httpLogStream}));

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
  console.log("Moh is connected");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});
      
app.use(['/user', '/medicalinfo'],middleware)
// Routes
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/pay", paymentRoute);
app.use("/session", sessionRoute);


app.listen(config.app.port);
console.log("App running on port "+config.app.port);
