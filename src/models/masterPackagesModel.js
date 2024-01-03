const mongoose = require('mongoose')

const packagesSchema = new mongoose.Schema({

    packageName: { type: String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Package', packagesSchema)