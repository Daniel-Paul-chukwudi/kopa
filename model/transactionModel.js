const mongoose = require('mongoose');


const transactionSchema =new mongoose.Schema({
      fullName: {
        type: String,
        trim: true,
        required: [true, 'Name is required'],
      },
      amount:{
        type: Number,
        default: 0
      },
      transactionType:{
        type: String,
        enum:['debit','credit'],
        required: true
      },
      platform:{
        type: String,
      },
      supporter:{
        type: String,
      },
      description:{
        type: String,
      },
      creatorId: {
        type:  mongoose.Schema.Types.ObjectId,
      },

      
  },
  {
    timestamps:true,
  }
);

const transactionModel = mongoose.model('transactions', transactionSchema);

module.exports = transactionModel; 