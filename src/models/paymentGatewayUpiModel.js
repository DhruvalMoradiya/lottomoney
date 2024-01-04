const mongoose = require('mongoose')

const upiSchema = new mongoose.Schema({

    upiID: { type:String, required: true,trim: true, },
    
    upiMerchantCode: { type:String, required: true,trim: true, },   

    upiTransactionNote: { type:String, required: true,trim: true, },
    
    upiPayeeName: { type:String, required: true,trim: true, }, 

    upiToken: { type:String, required: true,trim: true, }, 

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('UPI', upiSchema)