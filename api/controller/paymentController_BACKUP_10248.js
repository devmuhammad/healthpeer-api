const User = mongoose.model('User')
      ,config = require('../../config/index').moneywave
      ,moneywave = require('../../services/paymentService')(config.apiKey,config.secret)

exports.makeWithdrawal = function (req, res){
    User.findById(req.body.userId, function(err, user) {
        if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
<<<<<<< HEAD

        if (user) {
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
=======
    if (user){
        let body = {
            'lock': config.moneywave.lock,
            'amount': req.body.amount, 
            'bankcode': req.body.bankcode, 
            'accountNumber': req.body.accountNumber, 
            'currency': "NGN", 
            'senderName': "HealthPeer NG", 
            'ref':"KFKJ09090",
        }
        if (req.body.amount >= user.balance){
            return res.status(404).json({status:"error", message:"Insufficient Balance"})
        } else if (req.body.amount < user.balance){

            moneywave.WalletToAccountTransfer.transfer(body, function(err, trfinfo){
                if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
            if(trfinfo.data.data.responsecode === '00'){
                return res.status(200).json({status:"success", message:"", data:trfinfo.data});
            }
            });
        }
    }
    
})
};

exports.listBank = function (req, res){
    moneywave.Banks.get(function (err, banks){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
        
        if (banks.status === 'success' ){
            return res.status(200).json({status:"success", message:"banks Fetched", data:banks.data});
        }
    })
};

exports.validateAccountNumber = function(req, res){
let body = {
    'account_number': req.body.accountnumber,
     'bank_code': req.body.bankcode
>>>>>>> 4728309fead6baaccd6d9f28e6804641fa12caf2
}
moneywave.ValidateAccountNumber.validate(body, function(err, acctinfo){
    if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
    if (acctinfo.status === 'success' ){
        return res.status(200).json({status:"success", message:"", data:acctinfo.data});
    }

});
};

exports.getTotalCardCharge = function(req, res){
    let body = {
        'amount': req.body.amount,
         'fee': req.body.fee
    }
    moneywave.GetTotalChargeToCard.get(body, function(err, charges){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
        if (charges.status === 'success' ){
            return res.status(200).json({status:"success", message:"", data:charges.data});
        }
    });
};

exports.transactionStatus = function(req, res){
    moneywave.TransStatusCardToAccount.check(req.body.ref, function(err, transtatus){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
        if (transtatus.status === 'success' ){
            return res.status(200).json({status:"success", message:"Withdrawal Successful", data:transtatus.data});
        }
    });
    
};
exports.RetryFailedTransaction = function(req, res){
    let body = {
        'id': req.body.id,
        'recipient_account_number': req.body.accountnumber,
        'recipient_bank': req.body.bankcode
    }
    moneywave.RetryFailedTransaction.check(body, function(err, transtatus){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
        if (transtatus.status === 'success' ){
            return res.status(200).json({status:"success", message:"Withdrawal Successful"});
        }
    });

};