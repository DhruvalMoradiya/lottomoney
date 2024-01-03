const mongoose = require('mongoose')

const playListSchema = new mongoose.Schema({

    playListName: { type: String, required: true,trim: true, },   

    // language: { type: String, required: true,trim: true,},

    playListImage: { type: String},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('playList', playListSchema)