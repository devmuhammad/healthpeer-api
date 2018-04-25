const User            = require('./userModel')       //import Models
      ,medicalInfo    = require('./medicalInfoModel')
      ,consultHistory = require('./consultHistoryModel')
      ,consultInfo    = require('./consultInfoModel')
      ,Thread         = require('./thread')

module.exports = {
  user: User,
  medicalInfo: medicalInfo,
  consultationHistory: consultHistory,
  consultantInformation: consultInfo,
  Thread: Thread
}