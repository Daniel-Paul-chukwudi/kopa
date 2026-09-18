const creatorModel = require('../model/creatorModel')
const paymentModel = require('../model/paymentModel')
const creatorAccountModel = require('../model/creatorAccountModel')
const transactionModel = require('../model/transactionModel')
const notificationModel = require('../model/notificationModel')
const helpers = require('../helper/helpers')
const jwt = require('jsonwebtoken')
const sendEmail = require('../utils/Bmail')


exports.createcreator = async (req,res)=>{
    try {
        const {email,password,confirm} = req.body

        const existingEmail = await creatorModel.findOne({ email: email.toLowerCase().trim() })
        
        if (existingEmail) {
            return res.status(400).json({ 
                message: 'Email is already registered'
            })
        }

        if (password !== confirm){
            return res.status(400).json({
                message: "Passwords mismatch"
            })
        }

        const hashPassword = await helpers.hashPassword(password)
        
        let url = ''
        let publicId = ''

        if(req.file){
            const image = await uploadImageToCloudinary(req.file.path)
            if(!image.success){
                console.error(
                `Error uplaoding image`
                );
            }
            url = image?.imageSecureUrl ?? ''
            publicId = image?.imagePublicId ?? ''
        }
        const code = await helpers.randomCodegenerator()
        const otp = await helpers.otpGenerator()

        const creator = new creatorModel({
                email:email.toLowerCase(),
                password:hashPassword,
                link:code,
                otp:otp,
                profileImageUrl: url,
                profileImagePublicId: publicId,
            })
            
            await creator.save()

            // const token = jwt.sign({id:creator._id}, process.env.JWT_SECRET, { expiresIn: '1d'})
            // const link = `https://mystorelink.vercel.app/verify-email/${token}`
            
            const emailOptions = {
            email: creator.email,
            subject: 'Please verify your account',
            html: helpers.verifyEmail(creator.fullName,otp),
            }
            
            await sendEmail(emailOptions)

            res.status(201).json({
                message: "Account created successfully",
                data:creator,
                otp,
            })
    } catch (error) {
        res.status(500).json({
            message: "Error creating account",
            error: error.message
        })
    }
}

exports.verifyAccount = async (req,res) => {
    try {
        
        const token = req.params.token

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded === null){
            return res.status(403).json({
                message:"invalid token or token expired",
                error:error
            })
        }
        const creator = await creatorModel.findById(decoded.id)
        
        if (!creator) {
            return res.status(404).json({ 
                message: 'Account not found'
            })
        }

        if(creator.isVerified == true){
            return res.status(400).json({
                message: "Account already verified ,Please Login"
            })
        }

        creator.isVerified = true
        await creator.save()

        res.status(200).json({ 
            message: 'Account verified successfully',
            success:true,
            data: {
                _id: creator._id,
                fullName: creator.fullName,
                email: creator.email,
                isVerified: creator.isVerified
            },
            loginToken: token
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error verifying account',
            error: error.message
        })
    }
}

exports.verifyOtp = async (req,res) => {
    try {

        const {email,otp} = req.body
        // console.log(req.body);
        

        const creator = await creatorModel.findOne({email:email})
        // console.log(creator);
        
        if (!creator) {
            return res.status(404).json({ 
                message: 'invalid details 1'
            })
        }

        if (creator.otp !== otp) {
            return res.status(404).json({ 
                message: 'invalid details'
            })
        }

        if(creator.isVerified == true){
            return res.status(400).json({
                message: "Account already verified ,Please Login"
            })
        }

        creator.isVerified = true
        creator.otp = ''
        await creator.save()
        const token = jwt.sign({id:creator._id}, process.env.JWT_SECRET, { expiresIn: '1d'})

        res.status(200).json({ 
            message: 'Account verified successfully',
            success:true,
            data: {
                _id: creator._id,
                fullName: creator.fullName,
                email: creator.email,
                isVerified: creator.isVerified,
                loginToken:token
            },
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error verifying account',
            error: error.message
        })
    }
}

exports.updateAccount = async (req,res)=>{
    try {
        const {id} = req.user
        const creator = await creatorModel.findById(id)

        const updates = { 
            ...req.body
        }
 
        if (req.file) {
            // Delete old picture if one exists
            if (creator.profileImagepublicId) {
                await helpers.deleteImageFromCloudinary(creator.profileImagepublicId)
            }
            const image = await helpers.uploadImageToCloudinary(req.file.path)
            if(!image.success){
                console.error(
                `Error uplaoding image`
                );
            }
            updates.profileImageUrl = image.imageSecureUrl ?? ''
                
            updates.profileImagePublicId = image.imagePublicId ?? ''
            
        }
 
        const updatedCreator = await creatorModel.findByIdAndUpdate(id, updates, { new: true })
 
        res.status(200).json({ 
            message: 'Account updated',
            data: updatedCreator 
        })

        
    } catch (error) {
        res.status(500).json({
            message: "Error updating creator",
            error: error.message
        }) 
    }
}

exports.onboarding = async (req,res)=>{
    try {
        const {id} = req.user
        const {fullName,userName,accountName,bio,category,phoneNumber} = req.body
        const creator = await creatorModel.findById(id)

        if (!creator) {
            return res.status(404).json({ message: 'creator not found' })
        }
        if (creator.onboarded) {
            return res.status(400).json({ message: 'creator already onboarded' })
        }
        if(!fullName || !userName || !accountName || !bio || !category || !phoneNumber){
            return res.status(400).json({ message: 'please fill in all the details' })
        }

        const Ucheck = await creatorModel.findOne({userName})
        if (Ucheck) {
            return res.status(400).json({ 
                message: 'userName is already in use'
            })
        }
        const Pcheck = await creatorModel.findOne({phoneNumber})
        if (Pcheck) {
            return res.status(400).json({ 
                message: 'phoneNumber is already in use'
            })
        }
 
        if (req.file) {
            // Delete old picture if one exists
            if (creator.profileImagepublicId) {
                await helpers.deleteImageFromCloudinary(creator.profileImagepublicId)
            }
            const image = await helpers.uploadImageToCloudinary(req.file.path)
            if(!image.success){
                console.error(
                `Error uplaoding image`
                );
            }
            updates.profileImageUrl = image.imageSecureUrl ?? ''
                
            updates.profileImagePublicId = image.imagePublicId ?? ''
            
        }

        
        if(!creator.onboarded){
            const creatorAccount = await creatorAccountModel.create({
            fullName,
            creatorId:id
        })
        creator.onboarded = true
        }

        creator.fullName = fullName
        creator.userName = userName
        creator.bio = bio
        creator.accountName = accountName
        creator.category = category
        creator.phoneNumber = phoneNumber
        await creator.save()

        res.status(200).json({ 
            message: 'Account onboarded',
            data: {
                creator
             }
        })

        
    } catch (error) {
        res.status(500).json({
            message: "Error onboarding creator",
            error: error.message
        }) 
    }
}

exports.getAll = async (req,res)=>{
    try {
        const creators = await creatorModel.find()

        res.status(200).json({
            message: "All Creators",
            data: creators
        })
        
    } catch (error) {
       res.status(500).json({
            message: "Error getting Creators",
            error: error.message
        }) 
    }
}

exports.getOne = async (req,res)=>{
    try {

        const {id} = req.user
        const creator = await creatorModel.findById(id)

        res.status(200).json({
            message: "Creator found",
            data: creator
        })
        
    } catch (error) {
       res.status(500).json({
            message: "Error getting creator",
            error: error.message
        }) 
    }
}

exports.deleteOne = async (req,res)=>{
    try {

        const {Id} = req.params
        console.log(Id);
        const x = Id
        
        const creator = await creatorModel.deleteOne({_id:Id})
        

        res.status(200).json({
            message: "Creator deleted lll",
            data:x
        })
        
    } catch (error) {
       res.status(500).json({
            message: "Error deleting creator",
            error: error.message
        }) 
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        const creator = await creatorModel.findOne({ email: email.toLowerCase() })

        if (!creator) {
            return res.status(404).json({
                message: 'User not found'
                // message: 'An OTP will be sent to the Email, if it is registered'
            })
        }

        creator.resetRequest = 'yes'
        await creator.save()
        
        const token = jwt.sign({id:creator._id}, process.env.JWT_SECRET, { expiresIn: '10m'})

        const link = `https://mystorelink.vercel.app/reset-password/${token}`
        // console.log(link);
        

        const emailOptions = {
            email: creator.email,
            subject: 'Reset password',
            html: forgotPassword(creator.fullName,link),
            }
            await sendEmail(emailOptions)

        res.status(200).json({
            message: 'A reset email will be sent ,check and follow the instructions to reset your account'
        })
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message})
    }
}

exports.resetPassword = async (req, res) => {
    try{
        const {newPassword, confirmPassword } = req.body
        const token = req.params.token
 
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(decoded === null){
            return res.status(403).json({
                message:"invalid token or token expired",
                error:error
            })
        }
        const creator = await creatorModel.findById(decoded.id)
 
        if (!creator) {
            return res.status(404).json({ message: 'User not found' })
        }

        if(creator.resetRequest === 'no'){
            return res.status(400).json({ 
                message: 'This link has already been used please request a new reset link' 
            })
        }

        const hashPassword = helpers.hashPassword(newPassword)

        creator.password      = hashPassword  // pre-save hook will hash it
        creator.resetRequest = 'no'
        await creator.save()
 
        res.status(200).json({ 
            message: 'Password reset successfully. You can now log in.' 
        })

    } catch (error) {
        res.status(500).json({ 
            message: 'Error reseting password',
            error: error.message
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body
        const { id } = req.user

        const creator = await creatorModel.findById(id).select('+password')
        if (!creator) {
            return res.status(404).json({ 
                message: 'creator not found' 
            })
        }
        const passmatch = helpers.comparePassword(currentPassword,creator.password)
        if (!passmatch) {
            return res.status(401).json({ message: 'Current password is incorrect' })
        }
 
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'New passwords do not match' })
        }
 
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password must differ from current password' })
        }
 
 
        creator.password = helpers.hashPassword(newPassword)  // pre-save hook will hash it
        await creator.save()
 
        res.status(200).json({ 
            message: 'Password changed successfully' 
        })

    } catch (error) {
        res.status(500).json({
            message: 'Error changing password',
            error: error.message
        })
    }
}

exports.AdminVerify = async (req,res)=>{
    try {
        const {id} = req.body
        // console.log(id);
        
        const venor = await creatorModel.findById(id)
        // console.log(venor);
        
        venor.isVerified = true
        await venor.save()
        res.status(200).json({
            message: "done",
            data:venor
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error verifying',
            error: error.message
        })   
    }
}

exports.loginCreator = async (req,res)=>{
    try {
        const {email,password} = req.body

         const creator = await creatorModel.findOne({email: email.toLowerCase() }).select('+password')
       
        if(!creator){
            return res.status(401).json({
                message: "Invalid Login Details"
            })
        }

       const passmatch = await helpers.comparePassword(password, creator.password)
 
        if(!passmatch){
            return res.status(403).json({
                message: "Invalid Login Details"
            })
        }

        if (!creator.isVerified) {

            // const token = jwt.sign({id:creator._id}, process.env.JWT_SECRET, { expiresIn: '1d'})
            // const link = `https://mystorelink.vercel.app/verify-email/${token}`
            // const emailOptions = {
            // email: creator.email,
            // subject: 'Please verify your account',
            // html: verifyAccount(creator.firstName,link),
            // }
            // await sendEmail(emailOptions)

            return res.status(403).json({ 
                message: 'Account not verified. Check your email to verify your account',
                success:false
            })

        }
        
        const response = jwt.sign({id:creator._id},process.env.JWT_SECRET, { expiresIn: '30m'})

        res.status(200).json({
            message: "login successful",
            success:true,
            loginToken: response
            
        })
    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            success:false,
            error: error.message
        })
    }
}

exports.viewCreator = async (req,res)=>{
  try {
        const link = req.params.link
        // console.log(id);
        // const platform = req.params.platform
        // console.log(platform);
        
        
        const creator = await creatorModel.findOne({link})
        // console.log(venor);
        
        if(!creator){
            res.status(404).json({
            message: "creator not found"
            })
        }

        res.status(200).json({
            message: "done",
            data:{
                name:creator.fullName,
                profileImageUrl:creator.profileImageUrl,
                category:creator.category,
                bio:creator.bio,
                donations:creator.donationTypes
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error viewing creator',
            error: error.message
        })   
    }
}

exports.generateLink = async (req,res)=>{
  try {
        const {id} = req.user
        // console.log(id);
        
        const creator = await creatorModel.findById(id)
        // console.log(venor);
        
        if(!creator){
            res.status(404).json({
            message: "creator not found"
            })
        }

        const links = {}

        for (const x of creator.socials){
            if(!links.x){
                links[x] = ''
            }
            links[x] =  `${creator.link}/${x}`
        }

        creator.donationLinks = links
        await creator.save()

        res.status(200).json({
            message: "done",
            data:creator
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error verifying',
            error: error.message
        })   
    }
}

exports.viewCreatorDashboard = async (req,res)=>{
  try {
       
        const {id} = req.user

        const creator = await creatorModel.findById(id)
        
        if (!creator) {
            return res.status(404).json({ 
                message: 'Account not found'
            })
        }
        if (!creator.onboarded) {
            return res.status(404).json({ 
                message: 'Account not onboarded'
            })
        }

        const creatorAccount = await creatorAccountModel.findOne({creatorId:creator._id})
        const transactions = await transactionModel.find({creatorId:creator._id})
        const notifications = await notificationModel.find({creatorId:creator._id})


        res.status(200).json({
            message: "done",
            data:{
                Name: creator.fullName,
                accountBalance: creatorAccount.accountBalance,
                creatorTransactions:transactions,
                notifications
            }
        })
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching dashboard',
            error: error.message
        })   
    }
}