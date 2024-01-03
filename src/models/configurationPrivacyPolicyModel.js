const mongoose = require('mongoose')

const privacyPolicySchema = new mongoose.Schema({

    privacyPolicy: { type:String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('PrivacyPolicy', privacyPolicySchema)