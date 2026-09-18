const {
    createcreator,
    changePassword,
    verifyAccount,
    viewCreator,
    AdminVerify,
    getAll,
    getOne,
    updateAccount,
    deleteOne,
    forgotPassword,
    loginCreator,
    viewCreatorDashboard,
    verifyOtp,
    onboarding,
    generateLink
} = require('../controller/creatorController')
const { checkLogin } = require('../middleware/auth')
const upload = require('../middleware/multer')

const router = require('express').Router()

/**
 * @swagger
 * /creator/create:
 *   post:
 *     summary: Create a new creator account
 *     description: Creates a new creator account and sends an OTP to the creator's email for verification.
 *     tags:
 *       - Creator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - confirm
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: creator@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *               confirm:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account created successfully
 *                 data:
 *                   type: object
 *                   description: Newly created creator account
 *                 otp:
 *                   type: string
 *                   example: "123456"
 *
 *       400:
 *         description: Email already registered or passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     emailExists:
 *                       value: Email is already registered
 *                     passwordMismatch:
 *                       value: Passwords mismatch
 *
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error creating account
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/create', createcreator)


router.post('/login', loginCreator)

router.patch('/updateCreator',checkLogin, updateAccount)

router.patch('/onboarding',checkLogin, onboarding)

router.delete('/deleteCreator/:Id', deleteOne)

router.post('/changePassword',checkLogin, changePassword)

router.post('/forgotPassword', forgotPassword)

router.post('/generateLink',checkLogin, generateLink)

router.post('/verify', verifyOtp)

router.get('/getAll', getAll)

router.get('/getOne', getOne)

router.get('/viewCreator/:link/:platform', viewCreator)

router.get('/viewCreator/:link', viewCreator)

router.get('/dashboard',checkLogin, viewCreatorDashboard)

module.exports = router