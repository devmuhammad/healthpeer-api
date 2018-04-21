
User = mongoose.model('User')
config = require('../../config/index')
const moneywave = require('../../services/paymentService')(config.moneywave.apiKey,config.moneywave.secret);

exports.makeCardPayment = function(req, res){
    User.findById(req.body.userId, function(err, user){
        if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
    if (user){
        firstname = user.firstName;
        lastname = user.lastName;
        phonenumber = user.phoneNumber;
        email = user.email
    let body = {
        'firstname':firstname, 
        'lastname':lastname,
        'phonenumber':phonenumber, 
        'email':email, 
        'recipient':wallet, 
        'card_no':req.body.card_no, 
        'cvv':req.body.cvv, 
        'expiry_year':req.body.expiry_year, 
        'expiry_month':req.body.expiry_month, 
        'apiKey':config.moneywave.apiKey, 
        'amount':req.body.amount, 
        'fee':0, 
        'redirecturl':g, // endpoint to save transaction details
        'medium':req.body.requestmedium,
    }
    moneywave.CardToWallet.charge(body, function(err, res){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Server"});}


    })
}
})
};

exports.makeAccountPayment = function(req, res){
    User.findById(req.body.userId, function(err, user){
        if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
    if (user){
        firstname = user.firstName;
        lastname = user.lastName;
        phonenumber = user.phoneNumber;
        email = user.email
    let body = {
        'firstname':firstname, 
        'lastname':lastname,
        'phonenumber':phonenumber, 
        'email':email, 
        'recipient':wallet, 
        //'charge_with':req.body.charge_with, 
        'sender_account_number':req.body.accountnumber, 
        'sender_bank':req.body.bank, 
        'apiKey':config.moneywave.apiKey, 
        'amount':req.body.amount, 
        'fee':0, 
        'redirecturl':g, // endpoint to save transaction details
        'medium':req.body.requestmedium,
    }
    moneywave.AccountToWallet.transfer(body, function(err, res){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Server"});}


    })
}
})
};

exports.makeAccountPayment = function(req, res){
    User.findById(req.body.userId, function(err, user){
        if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
    if (user){
        firstname = user.firstName;
        lastname = user.lastName;
        phonenumber = user.phoneNumber;
        email = user.email
    let body = {
        'firstname':firstname, 
        'lastname':lastname,
        'phonenumber':phonenumber, 
        'email':email, 
        'recipient':wallet, 
        //'charge_with':req.body.charge_with, 
        'charge_auth':internetbanking,
        'sender_bank':req.body.bank, 
        'apiKey':config.moneywave.apiKey, 
        'amount':req.body.amount, 
        'fee':0, 
        'redirecturl':g, // endpoint to save transaction details
        'medium':req.body.requestmedium,
    }
    moneywave.PayWithInternetBanking.transfer(body, function(err, res){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Server"});}


    })
}
})
};

