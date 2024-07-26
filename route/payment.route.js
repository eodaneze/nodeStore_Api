const {handlePaymentRedirect} = require('../controller/payment.controller')
const router = require('express').Router();


router.get("/payment-redirect", handlePaymentRedirect)


module.exports = router