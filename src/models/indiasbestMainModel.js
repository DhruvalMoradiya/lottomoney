const mongoose = require('mongoose')

const indiasBestMainSchema = new mongoose.Schema({

    indiasBestPlayListMainName: { type: String, required: true,trim: true, },   

    //  playListImage: { type: String},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('indiasBestMain', indiasBestMainSchema)