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
 * /create:
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


/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login creator
 *     description: Authenticates a creator using their email and password and returns a JWT login token.
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
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: creator@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: login successful
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 loginToken:
 *                   type: string
 *                   description: JWT authentication token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *       401:
 *         description: Invalid login details because the account does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Login Details
 *
 *       403:
 *         description: Invalid password or account is not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid Login Details
 *                 success:
 *                   type: boolean
 *                   example: false
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
 *                   example: Login failed
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/login', loginCreator)

/**
 * @swagger
 * /updateCreator:
 *   patch:
 *     summary: Update creator account
 *     description: Updates the authenticated creator's account information.
 *     tags:
 *       - Creator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               userName:
 *                 type: string
 *                 example: johndoe
 *               accountName:
 *                 type: string
 *                 example: John's Store
 *               bio:
 *                 type: string
 *                 example: Content creator and entrepreneur
 *               category:
 *                 type: string
 *                 example: Fashion
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *               socials:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["whatApp", "instagram"]
 *               donationTypes:
 *                 type: object
 *                 description: Custom donation types and their corresponding amounts.
 *                 additionalProperties:
 *                   type: number
 *                 example: {"basic": 400, "special": 1000}
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account updated
 *                 data:
 *                   type: object
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *       500:
 *         description: Error updating creator
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error updating creator
 *                 error:
 *                   type: string
 *                   example: Database update failed
 */
router.patch('/updateCreator', checkLogin, updateAccount)

/**
 * @swagger
 * /onboarding:
 *   patch:
 *     summary: Complete creator onboarding
 *     description: Completes the onboarding process for an authenticated creator by saving their profile and account information.
 *     tags:
 *       - Creator
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - userName
 *               - accountName
 *               - bio
 *               - category
 *               - phoneNumber
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               userName:
 *                 type: string
 *                 example: johndoe
 *               accountName:
 *                 type: string
 *                 example: John's Store
 *               bio:
 *                 type: string
 *                 example: Content creator and entrepreneur
 *               category:
 *                 type: string
 *                 example: Fashion
 *               phoneNumber:
 *                 type: string
 *                 example: "+2348012345678"
 *
 *     responses:
 *       200:
 *         description: Account onboarded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account onboarded
 *                 data:
 *                   type: object
 *                   properties:
 *                     creator:
 *                       type: object
 *                       description: Updated creator information
 *
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     alreadyOnboarded:
 *                       value: creator already onboarded
 *                     missingDetails:
 *                       value: please fill in all the details
 *                     usernameTaken:
 *                       value: userName is already in use
 *                     phoneTaken:
 *                       value: phoneNumber is already in use
 *
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
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
 *                   example: creator not found
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
 *                   example: Error onboarding creator
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.patch('/onboarding', checkLogin, onboarding)

/**
 * @swagger
 * /deleteCreator/{Id}:
 *   delete:
 *     summary: Delete a creator
 *     description: Deletes a creator account using the creator's ID.
 *     tags:
 *       - Creator
 *
 *     parameters:
 *       - in: path
 *         name: Id
 *         required: true
 *         description: The unique ID of the creator to delete
 *         schema:
 *           type: string
 *           example: 64f123abc456def789012345
 *
 *     responses:
 *       200:
 *         description: Creator deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Creator deleted
 *                 data:
 *                   type: string
 *                   description: ID of the deleted creator
 *                   example: 64f123abc456def789012345
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
 *                   example: Error deleting creator
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.delete('/deleteCreator/:Id', deleteOne)

router.post('/changePassword',checkLogin, changePassword)

router.post('/forgotPassword', forgotPassword)

/**
 * @swagger
 * /generateLink:
 *   post:
 *     summary: Generate creator donation links
 *     description: Generates donation links for the authenticated creator based on their configured social media platforms.
 *     tags:
 *       - Creator
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Donation links generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: done
 *                 data:
 *                   type: object
 *                   description: Updated creator information including generated donation links
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
 *                   example: creator not found
 *
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
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
 *                   example: Error verifying
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/generateLink', checkLogin, generateLink)

/**
 * @swagger
 * /verify:
 *   post:
 *     summary: Verify creator account
 *     description: Verifies a creator's account using the OTP sent to their email address. A login token is returned after successful verification.
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
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: creator@example.com
 *               otp:
 *                 type: string
 *                 example: "123456"
 *
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account verified successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f123abc456def789012345
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     email:
 *                       type: string
 *                       example: creator@example.com
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     loginToken:
 *                       type: string
 *                       description: JWT authentication token
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *       400:
 *         description: Account has already been verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Account already verified ,Please Login
 *
 *       404:
 *         description: Invalid email or OTP
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     invalidEmail:
 *                       value: invalid details 1
 *                     invalidOtp:
 *                       value: invalid details
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
 *                   example: Error verifying account
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/verify', verifyOtp)

/**
 * @swagger
 * /getAll:
 *   get:
 *     summary: Get all creators
 *     description: Retrieves all creators from the database.
 *     tags:
 *       - Creator
 *
 *     responses:
 *       200:
 *         description: All creators retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All Creators
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Creator information
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
 *                   example: Error getting Creators
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/getAll', getAll)

router.get('/getOne', getOne)

/**
 * @swagger
 * /viewCreator/{link}:
 *   get:
 *     summary: View creator profile
 *     description: Retrieves a creator's public profile using their unique creator link. This route can be used when no social media platform is provided.
 *     tags:
 *       - Creator
 *
 *     parameters:
 *       - in: path
 *         name: link
 *         required: true
 *         description: The creator's unique link
 *         schema:
 *           type: string
 *           example: abc123
 *
 *     responses:
 *       200:
 *         description: Creator profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: done
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     profileImageUrl:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     category:
 *                       type: string
 *                       example: Fashion
 *                     bio:
 *                       type: string
 *                       example: Content creator and entrepreneur
 *                     donations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - Bank Transfer
 *                         - Card
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
 *                   example: creator not found
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
 *                   example: Error viewing creator
 *                 error:
 *                   type: string
 *                   example: Internal server error
 *
 * /viewCreator/{link}/{platform}:
 *   get:
 *     summary: View creator profile with platform
 *     description: Retrieves a creator's public profile using their unique creator link and an optional social media platform. The platform route is used when the frontend has a platform available.
 *     tags:
 *       - Creator
 *
 *     parameters:
 *       - in: path
 *         name: link
 *         required: true
 *         description: The creator's unique link
 *         schema:
 *           type: string
 *           example: abc123
 *
 *       - in: path
 *         name: platform
 *         required: true
 *         description: Social media platform associated with the visit.
 *         schema:
 *           type: string
 *           example: instagram
 *
 *     responses:
 *       200:
 *         description: Creator profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: done
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: John Doe
 *                     profileImageUrl:
 *                       type: string
 *                       example: https://example.com/profile.jpg
 *                     category:
 *                       type: string
 *                       example: Fashion
 *                     bio:
 *                       type: string
 *                       example: Content creator and entrepreneur
 *                     donations:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example:
 *                         - Bank Transfer
 *                         - Card
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
 *                   example: creator not found
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
 *                   example: Error viewing creator
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/viewCreator/:link', viewCreator)
router.get('/viewCreator/:link/:platform', viewCreator)

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get creator dashboard
 *     description: Retrieves the authenticated creator's dashboard information, including account balance, transactions, and notifications.
 *     tags:
 *       - Creator
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Dashboard retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: done
 *                 data:
 *                   type: object
 *                   properties:
 *                     Name:
 *                       type: string
 *                       example: John Doe
 *                     accountBalance:
 *                       type: number
 *                       example: 50000
 *                     creatorTransactions:
 *                       type: array
 *                       description: List of transactions belonging to the creator
 *                       items:
 *                         type: object
 *                     notifications:
 *                       type: array
 *                       description: List of notifications belonging to the creator
 *                       items:
 *                         type: object
 *
 *       401:
 *         description: Unauthorized - authentication token is missing or invalid
 *
 *       404:
 *         description: Account not found or account has not been onboarded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   examples:
 *                     accountNotFound:
 *                       value: Account not found
 *                     notOnboarded:
 *                       value: Account not onboarded
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
 *                   example: Error fetching dashboard
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/dashboard', checkLogin, viewCreatorDashboard)

module.exports = router