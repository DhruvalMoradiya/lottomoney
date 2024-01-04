const mongoose = require('mongoose')

const razorPaySchema = new mongoose.Schema({

    razorPayAPIKey: { type:String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('RazorPay', razorPaySchema)