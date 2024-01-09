const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const withdrawRequestSchema = new mongoose.Schema({

    userId: { type: ObjectId, ref: "LuckyLottoUser",trim: true, },   

    paymentId:{ type: String,trim: true,},

    amount:{ type: String,trim: true,},

    wallet:{ type: String,trim: true,},

    accountNo: { type: String,trim: true,},

    remark:{type:String,trim: true,},

    status:{type:String,trim: true},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('WithdrawRequest', withdrawRequestSchema)