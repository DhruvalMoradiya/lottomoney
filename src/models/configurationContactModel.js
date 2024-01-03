const mongoose = require('mongoose')

const contactUsSchema = new mongoose.Schema({

    contactUs: { type:String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('ContactUs', contactUsSchema)