const mongoose = require('mongoose')

const termsAndConditionsSchema = new mongoose.Schema({

    termsAndCondition: { type:String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('TermsAndCondition', termsAndConditionsSchema)