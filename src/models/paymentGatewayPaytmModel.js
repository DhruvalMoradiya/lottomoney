const mongoose = require('mongoose')

const paytmSchema = new mongoose.Schema({

    paytmMerchantID: { type:String, required: true,trim: true, },
    
    paytmMerchantKey: { type:String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Paytm', paytmSchema)