const mongoose = require('mongoose')

const artistSchema = new mongoose.Schema({

    artistName: { type: String, required: true,trim: true, },   

    language: { type: String, required: true,trim: true,},

    artistImage: { type: String},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('artist', artistSchema)