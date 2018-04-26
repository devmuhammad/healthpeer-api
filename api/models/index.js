const  User           = require('./userModel')       //import Models
      ,medicalInfo    = require('./medicalInfoModel')
      ,consultHistory = require('./consultHistoryModel')
      ,consultInfo    = require('./consultInfoModel')
      ,consultantTransaction = require('./transactionModel')
      ,userPayment    = require('./paymentModel')
      ,session        = require('./session')
      ,Thread         = require('./thread')
      ,ThreadMessage  = require('./threadMessages')
      ,Patient        = require('./patient')
      ,Consultant     = require('./consultant')
      ,BloodBank      = require('./bloodBank')

module.exports = {
  user: User,
  medicalInfo: medicalInfo,
  consultationHistory: consultHistory,
  consultantInformation: consultInfo,
  consultantTransaction: consultantTransaction,
  payment: userPayment,
  session: session,
  Thread: Thread,
  ThreadMessage: ThreadMessage,
  Patient: Patient,
  Consultant: Consultant,
  BloodBank: BloodBank
}
