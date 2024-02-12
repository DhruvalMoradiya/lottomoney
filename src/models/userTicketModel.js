const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const ticketSchema = new mongoose.Schema({

    userId: { type: ObjectId, ref: "LuckyLottoUser",trim: true, },

    contestId:{ type: ObjectId, ref: "Contest",trim: true, },

    entryFee:{ type: String,trim: true,},

    ticketNo:{ type: String,trim: true,},

    winner: { type: String, default:"luser" },

    deletedAt: { type: Date },   
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Ticket', ticketSchema)