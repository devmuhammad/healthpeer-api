const app             = require('express')()
      ,mongoose       = require('mongoose')
      ,config         = require('./config')
      ,dbConfig       = require('./config/database.config')
      ,bodyParser     = require('body-parser')
      ,Routes         = require('./api/routes')
      ,middleware     = require('./api/middleware/verifyToken')
      ,morgan         = require('morgan')
      ,fs             = require('fs')
      ,path           = require('path');

// parse request to JSOn
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  

// websocket
const server = require('http').Server(app);
const io = require('socket.io')(server);
io.listen(config.app.port, () => console.log("App running on port "+config.app.port) );

io.on("connection", function(socket) {

})


// mongoose connection
mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
  keepAlive: true,
  reconnectTries: 30,
})
.then(() => {
  console.log("DB connection succesfull.");
}).catch(err => {
  console.log('Could not connect to the database. Exiting now...');
  process.exit();
});


//monitor DB connection    
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', () => { console.log(`Connected to db at ${dbConfig.url}`); }); 
 

// log http request
let httpLogStream = fs.createWriteStream(path.join(__dirname, 'httplogs.log'), {flags: 'a'})    
app.use(morgan('combined', {stream: httpLogStream}));


//Apply middleware
app.use(['/user', '/medicalinfo'],middleware)
// Routes
app.use("/user", Routes.user);
app.use("/auth", Routes.auth);
app.use("/pay", Routes.payment);



