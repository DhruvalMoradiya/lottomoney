const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const meghalottoActivitySchema = new mongoose.Schema({

    contestId:{ type: ObjectId, ref: "Contest",trim: true, },

    userId:{ type: ObjectId, ref: "LuckyLottoUser",trim: true, },

    date: { type: String,trim: true,},

    ticket:{ type: String,trim: true,},

    contestFee:{ type: String,trim: true,},

    wonPrize: { type: String,trim: true, },

    status: { type: String,trim: true, },

    deletedAt: { type: Date },   
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('MeghalottoActivity', meghalottoActivitySchema)