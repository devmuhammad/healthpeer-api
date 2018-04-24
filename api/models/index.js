const User           = require('./api/models/userModel')       //import Models
      ,medicalInfo    = require('./api/models/medicalInfoModel')
      ,consultHistory = require('./api/models/consultHistoryModel')
      ,consultInfo    = require('./api/models/consultInfoModel')

module.exports = {
  user: User,
  medicalInfo: medicalInfo,
  consultationHistory: consultHistory,
  consultantInformation: consultInfo
}