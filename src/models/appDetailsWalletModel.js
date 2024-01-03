const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const appDetailsWalletSchema = new mongoose.Schema({

    walletMode: { type: String,trim: true,},

    minWithdraw: { type: String,trim: true,},

    maxWithdraw: { type: String,trim: true,},

    minDeposit:{ type: String,trim: true,},

    maxDeposit:{ type: String,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('wallet', appDetailsWalletSchema)