const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const prizePoolSchema = new mongoose.Schema({ 

    price: { type: String, required: true,trim: true,},

    rank:{type: String, required: true,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('PrizePool', prizePoolSchema)