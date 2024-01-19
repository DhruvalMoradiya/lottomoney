const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const sendNotificationSchema = new mongoose.Schema({

    title:{ type: String,trim: true,},

    message:{ type: String,trim: true,},

    imageURL: {type:String,trim:true,},

    externalLink:{ type: String,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('SendNotification', sendNotificationSchema)