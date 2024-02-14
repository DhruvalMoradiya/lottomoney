const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const feesSchema = new mongoose.Schema({

    customId: { type: String, required: true, unique: true },

    packageId: { type: ObjectId, ref: "Package", required: true,trim: true, },   

    price: { type: String, required: true,trim: true,},

    noOfWinner:{type: String, required: true,trim: true,},
    
    noOfTicket:{type: String, required: true,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Fee', feesSchema)