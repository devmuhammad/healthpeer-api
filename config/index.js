module.exports = {  
  app: {
    "port": process.env.PORT || 6990,
    "secret" : 'toplevelhighlyclassifiedsecret',
  },
  moneywave:{
    "apiKey":"ts_ZISPSJAKM13ZACA4447N",
    "secret":"ts_AT8TI5W6VQM7ZV7E6EI6ALQ6LM3PBH",
    "lock": "healthpeer@1"
  },
  pusher: {
    "instance_locator": "v1:us1:4cb9c4b8-5cdc-48b4-92ff-3afe48ea9661",
    "key": "a9187922-0d1c-467b-a065-5254753ff375:86pmko5ZQDr3JPus++HfbRsPeAQmm3FrtvNHL1ZFZCw="
  }
}