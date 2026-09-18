const otpGen = require('otp-generator')
const bcrypt = require('bcrypt')
const cloudinary = require('../utils/cloudinary')
const fs = require('fs')


exports.randomCodegenerator = () =>{
    const code = otpGen.generate(12, { upperCaseAlphabets: true, lowerCaseAlphabets: true, digits: true, specialChars: false })
    return code
}

exports.otpGenerator = () =>{
    const code = otpGen.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, digits: true, specialChars: false })
    return code
}

exports.hashPassword = async (password) =>{
    const newPassword = await bcrypt.hash(password, 12)
    return newPassword
}

exports.comparePassword = async (current,compare) => {
    const check = await bcrypt.compare(current, compare)
    return check
}

exports.uploadImageToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath);
    
    fs.unlinkSync(filePath);

    return {
      success: true,
      imageSecureUrl: result.secure_url,
      imagePublicId: result.public_id
    }

  } catch (error) {
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
    success: false,
    error: error.message
    };
  }
};

exports.deleteImageFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);

    // future info for deleting multiple
    // await cloudinary.api.delete_resources(["img1", "img2"]);

    return "Ok";

  } catch (error) {
    res.status(500).json({
        message: "Image removal Failed",
        error:error.message
    })
  }
};

exports.verifyEmail = (name,otp) =>{
    return(
    ` 
    <!DOCTYPE html> 
    <html> 
    <head> 
    <meta charset="UTF-8"> 
    <title>Verification Code</title> 
    </head> 
    <body style=" margin: 0; padding: 0; background-color: #f3f6fa; font-family: Arial, Helvetica, sans-serif; "> <table width="100%" cellpadding="0" cellspacing="0"> <tr> <td align="center" style="padding: 40px 15px;"> <table width="600" cellpadding="0" cellspacing="0" style=" max-width: 600px; width: 100%; background: #ffffff; border-radius: 8px; overflow: hidden; " > 
    <!-- HEADER --> <tr> <td style=" background: #0d47a1; padding: 28px; text-align: center; "> 
    <div style=" color: #ffffff; font-size: 24px; font-weight: bold; "> 
    KOPA 
    </div> 
    <div style=" color: #dbeafe; font-size: 14px; margin-top: 6px; "> 
    Email Verification 
    </div> 
    </td> 
    </tr> 
    <!-- CONTENT --> 
    <tr> <td style="padding: 35px 30px;"> 
    <p style=" margin: 0 0 15px; color: #111827; font-size: 16px; "> 
    Hello ${name}, </p> <p style=" margin: 0 0 25px; color: #4b5563; font-size: 14px; line-height: 1.6; "> 
    Use the verification code below to complete your email verification. 
    </p> 
    <!-- OTP --> 
    <div style=" text-align: center; margin: 30px 0; "> 
    <div style=" display: inline-block; padding: 15px 30px; background: #eff6ff; border-radius: 8px; color: #0d47a1; font-size: 30px; font-weight: bold; letter-spacing: 8px; "> 
    ${otp} 
    </div> 
    </div> 
    <p style=" margin: 0; color: #6b7280; font-size: 13px; text-align: center; ">
    This code will expire shortly. </p> 
    <p style=" margin-top: 25px; color: #6b7280; font-size: 13px; line-height: 1.5; "> 
    If you did not request this code, you can safely ignore this email. </p> 
    </td> 
    </tr> 
    <!-- FOOTER --> 
    <tr> 
    <td style=" padding: 20px 30px; background: #f8fafc; text-align: center; color: #6b7280; font-size: 12px; "> 
    This is an automated message from KOPA. 
    <br><br> © ${new Date().getFullYear()} KOPA </td> </tr> </table> </td> </tr> </table> </body> </html> `)
};


