const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const appDetailsNotificationSchema = new mongoose.Schema({

    googleFCMserverkey: { type: String,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Notification', appDetailsNotificationSchema)