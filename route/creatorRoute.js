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