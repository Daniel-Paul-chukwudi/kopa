const mongoose = require('mongoose');


const notificationSchema =new mongoose.Schema({
      content: {
        type: String,
        trim: true,
        required: [true, 'Name is required'],
      },
      type:{
        type: String,
      },
      status:{
        type: String,
        enum:['seen','unseen']
      },
      creatorId: {
        type:  mongoose.Schema.Types.ObjectId,
      },

      
  },
  {
    timestamps:true,
  }
);

const notificationModel = mongoose.model('notifications', notificationSchema);

module.exports = notificationModel; 