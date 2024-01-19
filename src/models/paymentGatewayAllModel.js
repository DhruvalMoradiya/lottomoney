const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const allPaytmSchema = new mongoose.Schema({

    modeofPaymentId: { type: ObjectId, ref: "ModeofPayment", required: true, trim: true, },  

    razorPayAPIKey: { type:String,trim: true, },  

    paytmMerchantID: { type:String,trim: true, },
    
    paytmMerchantKey: { type:String,trim: true, },
    
    upiID: { type:String,trim: true,},
    
    upiMerchantCode: { type:String,trim: true, },   

    upiTransactionNote: { type:String,trim: true, },
    
    upiPayeeName: { type:String,trim: true, }, 

    upiToken: { type:String,trim: true, }, 

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('AllPaytm', allPaytmSchema)