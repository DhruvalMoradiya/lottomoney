const mongoose = require('mongoose')

const packagesSchema = new mongoose.Schema({

    customId: { type: String, required: true, unique: true },

    packageName: { type: String, required: true,trim: true, },   

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Package', packagesSchema)