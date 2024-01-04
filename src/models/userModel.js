const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const userSchema = new mongoose.Schema({

    name: { type: String,trim: true,},

    email: { type: String, required: true, unique: true,trim: true,},

    mobile:{ type: String, required: true, unique: true,trim: true,},

    dateOfBirth:{ type: String,trim: true,},

    gender:{ type: String,trim: true,},

    deviceId: { type: String,trim: true,},

    profileImage: { type: String},

    userName:{type:String,trim: true,},

    countryCode:{type:String,trim: true},

    referral:{type:String,trim:true},

    fcmToken:{type:String,trim:true},

    totalCoin:{type:Number,default:0,trim:true},

    wonCoin:{type:Number,default:0,trim:true},

    bonusCoin:{type:Number,default:0,trim:true},

    status:{type:String,default:"active",trim:true},

    bankStatus:{type:String,default:"active",trim:true},

    password: { type: String, trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('lottouser', userSchema)