
User = mongoose.model('User')
config = require('../../config/index')
const moneywave = require('../../services/paymentService')(config.moneywave.apiKey,config.moneywave.secret);

exports.makeWithdrawal = function (req, res){
    User.findById(req.body.userId, function(err, user){
        if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
    if (user){
        let body = {
            'lock':f,
            'amount': req.body.amount, 
            'bankcode': req.body.bankcode, 
            'accountNumber': req.body.accountNumber, 
            'currency': "NGN", 
            'senderName': "HealthPeer NG", 
            'ref':g,
        }
    }
    
})
}
