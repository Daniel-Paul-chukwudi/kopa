const {initializePayment,webHook,verifyPayment,getAll} = require('../controller/paymentController')

const router = require('express').Router()

/**
 * @swagger
 * /creator/pay:
 *   post:
 *     summary: Initialize a donation payment
 *     description: Initializes a donation payment for a creator using the creator's unique link and returns the payment checkout URL.
 *     tags:
 *       - Creator
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - price
 *               - link
 *             properties:
 *               price:
 *                 type: number
 *                 minimum: 1
 *                 description: Donation amount in Nigerian Naira.
 *                 example: 5000
 *               supporter:
 *                 type: string
 *                 description: Name of the supporter. Defaults to Anonymous if not provided.
 *                 example: John Doe
 *               platform:
 *                 type: string
 *                 description: Platform from which the donation was initiated.
 *                 example: instagram
 *               link:
 *                 type: string
 *                 description: Unique link belonging to the creator receiving the donation.
 *                 example: abc123
 *
 *     responses:
 *       200:
 *         description: Payment initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment Initialized successfuly
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: KOPA-DON-123456-INS
 *                     url:
 *                       type: string
 *                       format: uri
 *                       example: https://checkout.korapay.com/checkout/abc123
 *                 payment:
 *                   type: object
 *                   description: Payment record created for the transaction.
 *                 paymentData:
 *                   type: object
 *                   description: Payment information sent to the payment provider.
 *
 *       400:
 *         description: Invalid payment amount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: invalid price
 *
 *       404:
 *         description: Creator not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: user not found
 *
 *       500:
 *         description: Payment initialization failed or internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error initializing payment
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   description: Error returned by the payment provider.
 */
router.post('/pay', initializePayment)

router.post('/payments/validate', webHook)

/**
 * @swagger
 * /creator/payment/validate:
 *   post:
 *     summary: Validate a payment
 *     description: Verifies a payment using its payment reference and updates the payment status and creator account when the payment is successful.
 *     tags:
 *       - Creator
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference
 *             properties:
 *               reference:
 *                 type: string
 *                 description: Unique payment reference generated during payment initialization.
 *                 example: KOPA-DON-123456-INS
 *
 *     responses:
 *       200:
 *         description: Payment validation completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment Verified Successfully
 *                 status:
 *                   type: string
 *                   enum:
 *                     - Success
 *                     - Failed
 *                     - Pending
 *                   example: Success
 *                 payment:
 *                   type: object
 *                   description: Payment record associated with the reference.
 *
 *       404:
 *         description: Payment or creator was not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     paymentNotFound:
 *                       value: Payment not found
 *                     userNotFound:
 *                       value: user not found
 *
 *       500:
 *         description: Error verifying payment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error verifying payment: Verification failed"
 */
router.post('/payment/validate', verifyPayment)

/**
 * @swagger
 * /creator/payments:
 *   get:
 *     summary: Get all payments
 *     description: Retrieves all payment records stored in the database.
 *     tags:
 *       - Creator
 *
 *     responses:
 *       200:
 *         description: All payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All the payments in the DB
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                   description: List of payment records.
 *
 *       500:
 *         description: Error fetching payments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error fetching payments
 *                 error:
 *                   type: string
 *                   example: Database connection error
 */
router.get('/payments', getAll)

// router.delete('/payments', deleteAll)

module.exports = router