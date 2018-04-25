const userRouter     = require('./userRoute')         //import routes
      ,authRouter     = require('./authRoute')
      ,paymentRoute   = require('./paymentRoute')
      ,sessionRoute   = require('./session')

module.exports = {
    user: userRouter,
    auth: authRouter,
    payment: paymentRoute,
    session: sessionRoute
}      