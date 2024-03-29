const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const contestSchema = new mongoose.Schema({

    customId: { type: String, required: true, unique: true },

    startDate:{ type: String,trim: true,},

    endDate:{ type: String,trim: true,},

    participants:{type: String,default:0},

    status:{type: String,trim: true,},

    deletedAt: { type: Date },   
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Contest', contestSchema)