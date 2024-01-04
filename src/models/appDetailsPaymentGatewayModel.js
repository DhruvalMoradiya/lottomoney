const mongoose = require('mongoose')

const modeOfPaymentSchema = new mongoose.Schema({

    modeofPayment: { type:String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('ModeofPayment', modeOfPaymentSchema)