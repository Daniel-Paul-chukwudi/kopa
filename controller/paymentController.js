const paymentModel = require('../model/paymentModel')
const creatorModel = require('../model/creatorModel')
const creatorAccountModel = require('../model/creatorAccountModel')
const transactionModel = require('../model/transactionModel')
const helpers = require('../helper/helpers')
const axios = require('axios')


exports.initializePayment = async (req, res) => {
  try {
      const {price,supporter,platform,link} = req.body
      const user = await creatorModel.findOne({link});
      const code = helpers.randomCodegenerator()
      const ref = `KOPA-DON-${code}-INS`
      
      if (user === null) {
        return res.status(404).json({
            message: 'user not found'
            })
        }
        
      if(price <= 0){
        return res.status(400).json({
            message: 'invalid price'
            })
      }

    // const redirect_url = `https://mystorelink.vercel.app/payment/redirect?tier=${encodeURIComponent(
    //   tier
    // )}&fullName=${encodeURIComponent(user.fullName)}&reference=${encodeURIComponent(
    //   ref
    // )}&amount=${encodeURIComponent(price)}`;

    const paymentData = {
      amount: price,
      currency: 'NGN',
      reference: ref,
      customer: {
        email: user.email,
        name: user.fullName
      }
    }
    // console.log(paymentData);
    const { data } = await axios.post('https://api.korapay.com/merchant/api/v1/charges/initialize', paymentData, {
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`
      }
    });


    
    
    const payment = new paymentModel({
      creatorId: user._id,
      paymentType:'donation',
      reference: ref,
      price,
      userName: user.fullName,
      supporter: supporter ?? 'Anonymous',
      platform: platform ?? 'hacker'

    });

    if (data?.status === true) {
      payment.status = 'Pending'
      await payment.save();
    }else if(data?.status === false){
      return res.status(500).json({
        message: "Error initializing payment"
      })
    }
  

    res.status(200).json({
      message: 'Payment Initialized successfuly',
      success:true,
      data: {
        reference: data?.data?.reference,
        url: data?.data?.checkout_url
      },
      payment,
      paymentData
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error initializing payment: ' + error.message,
      success:false,
      error: error.response?.data
    })
  }
};

exports.webHook = async (req, res) => {
  try {
    const { event , data } = req.body;
    const payment = await paymentModel.findOne({ reference:data.reference });
    // console.log(payment);
    
    if (payment === null) {
      return res.status(404).json({
        message: 'Payment not found'
      })
    }
    const creator = await creatorModel.findById(payment.creatorId)
    if (creator === null) {
      return res.status(404).json({
        message: 'user not found'
      })
    }
    const creatorAccount = await creatorAccountModel.findOne({creatorId:creator._id})

    if(payment.status === 'Successful'){
      return res.status(200).json({
        message:"payment already verified",
        status: 'Success',
        payment,
      })
    }

    let transaction 
    if ( event === "charge.success"){

      payment.status = 'Successful'
      await payment.save();
        if (payment.paymentType === 'donation'){
           creatorAccount.accountBalance += payment.price
           creatorAccount.save()

           transaction = await transactionModel.create({
            creatorId: creator._id,
            fullName:creator.fullName,
            amount:payment.price,
            transactionType:'credit',
            description: `Donation from ${supporter} coming from ${platfrom}`,
            platform,
            supporter
           })
        }
        
      res.status(200).json({
        message: 'Payment Verified Successfully',
        data: transaction

      })

    } else if (event === "charge.failed"){
      payment.status = 'Failed'
      await payment.save();
      res.status(200).json({
        message: 'Payment Failed via webhook'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying payment via webhook ' + error.message
    })
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {reference} = req.body;
    // console.log(reference);
    
    const payment = await paymentModel.findOne({reference:reference})
    // console.log(payment);
    
    if (payment === null) {
      return res.status(404).json({
        message: 'Payment not found'
      })
    }

    if(payment.status === 'Successful'){
      return res.status(200).json({
        message:"payment already verified",
        status: 'Success',
        payment,
      })
    }
    const creatorAccount = await creatorAccountModel.findOne({creatorId:payment.creatorId})

    const { data } = await axios.get(`https://api.korapay.com/merchant/api/v1/charges/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.KORA_SECRET_KEY}`
      }
    })

    const creator = await creatorModel.findById(payment.creatorId)
    if (creator === null) {
      return res.status(404).json({
        message: 'user not found'
      })
    }

    // console.log(data)
    if (data?.status === true && data?.data?.status === "success") {
      payment.status = 'Successful'
      
          
        if (payment.paymentType === 'donation'){
           creatorAccount.accountBalance += payment.price
           creatorAccount.save()

           transaction = await transactionModel.create({
            creatorId: creator._id,
            fullName:creator.fullName,
            amount:payment.price,
            transactionType:'credit',
            description: `Donation from ${payment.supporter} coming from ${payment.platfrom}`,
            platform:payment.platform,
            supporter:payment.supporter
           })
        }
      await payment.save();
        
      res.status(200).json({
        message: 'Payment Verified Successfully',
        status: 'Success',
        payment,

      })

    }else if (data?.status === true && data?.data?.status === "processing"){ 
      payment.status = 'Failed'
      await payment.save();
      res.status(200).json({
        message: 'Payment Failed via verification .',
        status: 'Failed'
      })
      }else{
      res.status(200).json({
        message: 'Payment pending ...',
        status: 'Pending'
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error verifying payment: ' + error.message
    })
  }
};

exports.getAll = async(req,res)=>{
    try {
        const payments = await paymentModel.find()
        res.status(200).json({
            message: `All the payments in the DB`,
            data: payments
        })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching payments",
            error: error.message
        })
    }
}

exports.deleteAll = async(req,res)=>{
    try {
        const payments = await paymentModel.deleteMany()
        res.status(200).json({
            message: `All the payments in the DB DELETED`,
        })

    } catch (error) {
        res.status(500).json({
            message: "Error fetching payments",
            error: error.message
        })
    }
}