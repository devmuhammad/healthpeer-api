const  User           = require('./userModel')       //import Models
      ,medicalInfo    = require('./medicalInfoModel')
      ,consultHistory = require('./consultHistoryModel')
      ,consultInfo    = require('./consultInfoModel')
      ,consultantTransaction = require('./transactionModel')
      ,userPayment    = require('./paymentModel')
      ,session        = require('./session')
      ,Thread         = require('./thread')

module.exports = {
  user: User,
  medicalInfo: medicalInfo,
  consultationHistory: consultHistory,
  consultantInformation: consultInfo,
  consultantTransaction: consultantTransaction,
  payment: userPayment,
  session: session,
  thread: Thread
}