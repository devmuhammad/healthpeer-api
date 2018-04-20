var jwt = require('jsonwebtoken');
var config = require('../../config');

function verifyToken (req, res, next) {
    var myUser
  var token = req.headers['x-access-token'];
  
  if (!token)
    return res.status(403).json({ auth: false, message: 'No token provided.' });
  jwt.verify(token, config.app.secret, function(err, decoded) {
    if (err)
    return res.status(500).json({ auth: false, message: 'No Authorization: Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    
    myUser = decoded.id
    
  });
  userId = myUser
//   req.userId = decoded.id;

  next()
}
module.exports = verifyToken;
