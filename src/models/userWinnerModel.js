const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const winnerSchema = new mongoose.Schema({

    userId: { type: ObjectId, ref: "LuckyLottoUser",trim: true, },

    contestId:{ type: ObjectId, ref: "Contest",trim: true, },

    deletedAt: { type: Date },   
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Winner', winnerSchema)