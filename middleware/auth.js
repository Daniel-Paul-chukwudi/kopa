const creatorModel = require('../model/creatorModel')
const jwt = require('jsonwebtoken')

exports.checkLogin = async (req,res,next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                message: 'Please login again to continue'
            })
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    
        const creator = await creatorModel.findById(decoded.id);

        if (creator === null) {
            return res.status(404).json({
                message: 'Authentication Failed: User not found'
            })
        }

        const response = {
            id:creator._id,
        }

        req.user = response;
        next()
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                message: 'Session expired, Please login again to continue',
                success: false,
                user:'creator'
            })
        }
        res.status(500).json({
            message:"internal server error",
            error: error.message
        })
    }
}