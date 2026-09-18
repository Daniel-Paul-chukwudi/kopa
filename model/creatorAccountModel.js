const mongoose = require('mongoose');


const creatorAccountSchema =new mongoose.Schema({
      fullName: {
        type: String,
        trim: true,
        required: [true, 'Name is required'],
      },
      accountBalance:{
        type: Number,
        default: 0
      },
      creatorId: {
        type:  mongoose.Schema.Types.ObjectId,
      },

      
  },
  {
    timestamps:true,
  }
);

const creatorAccountModel = mongoose.model('creatorAccounts', creatorAccountSchema);

module.exports = creatorAccountModel; 