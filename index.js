const app     = require('express')()
      ,config = require('./config');

app.listen(config.app.port);
console.log("App running on port "+config.app.port);