const mongoose       = require('mongoose')
const   User = mongoose.model('User')
const   config = require('../../config/index')
const   moneywave = require('../../services/paymentService')(config.moneywave.apiKey,config.moneywave.secret)
const   consultantTransaction = mongoose.model('consultantTransaction')

exports.makeWithdrawal = function (req, res){
    User.findById(req.body.userId, function(err, user){
        if (err) { return res.status(500).json({status:"error", message:"DB_ERROR"});}
    if (user){
        let refnum = Math.floor(Math.random()*90000) + 10000;
        let hpRef = 'HPWD'+refnum
        console.log(hpRef)
        let body = {
            'lock': config.moneywave.lock,
            'amount': req.body.amount, 
            'bankcode': req.body.bankcode, 
            'accountNumber': req.body.accountNumber, 
            'currency': "NGN", 
            'senderName': "HealthPeer NG", 
            'ref': hpRef,
        }
        if (req.body.amount >= user.balance){
            return res.status(404).json({status:"error", message:"Insufficient Balance"})
        } else if (req.body.amount < user.balance){

            moneywave.WalletToAccountTransfer.transfer(body, function(err, trfinfo){
                if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
            
                if (trfinfo.data.data.responsecode === '00'){
                return res.status(200).json({status:"success", message:"transaction Successful", data:trfinfo.data});
            let trans = {
                'userId': user._id,
                'userName': user.userName,
                'email': user.email,
                'phoneNumber': user.phoneNumber,
                'uniqueRef': trfinfo.data.data.uniquereference,
                'bankCode': body.bankcode,
                'accountNumber': body.accountNumber,
                'amountWithdrawn': body.amount,
                'responsecode': trfinfo.data.data.responsecode,
                'responsemessage': trfinfo.data.data.responsemessage
            };

            let newTransaction = new consultantTransaction (trans);
            newTransaction.save( function (err, transinfo){
                if (err) { return res.status(500).json({status:"error", message:"There was a problem adding the info to the DB"});}
                if (transinfo){ return res.status(200).json({status:"success", message:"transaction saved successfully", data:transinfo});}
                
            });
        }
        });
        }
    };
    
});
};

/**
 * Endpoint for listing Banks
 * @param {*} req
 * @param {} res
 */
exports.listBank = function (req, res){
    moneywave.Banks.get(function (err, banks){
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
        
        if (banks.status === 'success' ){
            return res.status(200).json({status:"success", message:"banks Fetched", data:banks.data});
        }
    })
};

/**
 * Endpoint for validating account Number
 * @param {accountnumber,bankcode} req
 * @param {} res
 */
exports.validateAccountNumber = function(req, res){
let body = {
    'account_number': req.body.accountnumber,
     'bank_code': req.body.bankcode
}
moneywave.ValidateAccountNumber.validate(body, function(err, acctinfo){
    if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
    if (acctinfo.status === 'success' ){
        return res.status(200).json({status:"success", message:"", data:acctinfo.data});
    }

});
};
/**
 * Endpoint for for getting Total charge
 * @param {amount,fee} req
 * @param {} res
 */
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

/**
 * Endpoint for creating Sub wallet
 * @param {name,password} req
 * @param {} res
 */
exports.createSubWallet = function(req, res){
    let body = {
        "name": req.body.name,
        "lock_code": req.body.password,
        "user_ref": "1",
        "currency": "NGN"
    }
    moneywave.CreateSubwallet.create(body, function(err, subwallet){
        
        if (err) { return res.status(500).json({status:"error", message:"Problem contacting Moneywave Server"});}
        if (subwallet.status === 'success' ){
            return res.status(200).json({status:"success", message:"Sub-Wallet Successfully Created", data:subwallet.data});
        }
        if (subwallet.status === 'error' ){
            { return res.status(401).json({status:"error", message:"Could not create sub wallet"});}
        }
    });

}
