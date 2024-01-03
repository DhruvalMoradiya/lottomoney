const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const appDetailsBasicInfoSchema = new mongoose.Schema({

    appName: { type: String,trim: true,},

    logo: [],

    favicon: [],

    appURL:{ type: String,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('BasicInfo', appDetailsBasicInfoSchema)