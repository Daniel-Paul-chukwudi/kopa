const mongoose = require('mongoose');

const paymentSchema =new mongoose.Schema({
      creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      paymentType:{
        type: String,
        enum: ['donation','purchase'],
      },
      userName:{
        type: String,
      },
      paymentPurpose:{
        type: String,
        default: 'donation'
      },
      price: {
        type: Number,
      },
      reference: {
        type: String,
      },
      supporter: {
        type: String,
      },
      platform: {
        type: String,
      },
      status: {
        type: String,
        enum: ['Pending', 'Successful', 'Failed'],
        default: 'Pending'
      }



  },
  {
    timestamps:true,
  }
);

const paymentModel = mongoose.model('payments', paymentSchema);

module.exports = paymentModel; 