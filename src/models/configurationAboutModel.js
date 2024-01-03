const mongoose = require('mongoose')

const aboutUsSchema = new mongoose.Schema({

    aboutUs: { type:String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('AboutUs', aboutUsSchema)