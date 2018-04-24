const userRouter     = require('./userRoute')         //import routes
      ,authRouter     = require('./authRoute')
      ,paymentRoute   = require('./paymentRoute')

module.exports = {
    user: userRouter,
    auth: authRouter,
    payment: paymentRoute
}      