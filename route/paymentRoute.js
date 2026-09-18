const {initializePayment,webHook,verifyPayment,getAll} = require('../controller/paymentController')

const router = require('express').Router()

router.post('/pay', initializePayment)

router.post('/payments/validate', webHook)

router.post('/payment/validate', verifyPayment)

router.get('/payments', getAll)

// router.delete('/payments', deleteAll)

module.exports = router