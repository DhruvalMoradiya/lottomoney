const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const appUpdateSchema = new mongoose.Schema({

    forceUpdate: { type: String,trim: true,},

    latestVersionName: { type: String,trim: true,},

    latestVersionCode: { type: String,trim: true,},

    url:{ type: String,trim: true,},

    Description:{ type: String,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('AppUpdate', appUpdateSchema)