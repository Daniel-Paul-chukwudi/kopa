const mongoose = require('mongoose');


const creatorSchema =new mongoose.Schema({
      fullName: {
        type: String,
        trim: true,
        // required: [true, 'Name is required'],
      },
      email:{
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true
      },
      password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
      },
      phoneNumber:{
        type: String,
        trim: true
      },
      accountName: {
        type: String
      },
      category: {
        type: String
      },
      userName: {
        type: String
      },
      bio: {
        type: String
      },
      donationTypes:{
        type: Object,
        default: {},
      },
      donationLinks:{
        type: Object,
        default: {},
      },
      socials:{
        type: Array,
        default: [],
      },
      link:{
        type: String,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      onboarded: {
        type: Boolean,
        default: false,
      },
      otp: {
        type: String
      },
      resetRequest:{
        type: String,
        enum: ['yes','no'],
        default: 'no'
      },
      profileImageUrl: {
        type: String
      },
      profileImagePublicId: {
        type: String
      },
      creatorMetaData:{
        type: Object,
        default: {},
        select: false
      },

      
  },
  {
    timestamps:true,
  }
);

const creatorModel = mongoose.model('creators', creatorSchema);

module.exports = creatorModel; 