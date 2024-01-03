const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const appDetailsOtherSchema = new mongoose.Schema({

    countryCode: { type: String,trim: true,},

    currencyCode: { type: String,trim: true,},

    currencySign: { type: String,trim: true,},

    timezone:{ type: String,trim: true,},

    sharePrize:{ type: String,trim: true,},

    downloadPrizeosit:{ type: String,trim: true,},

    bonusUsed:{ type: String,trim: true,},

    maintenanceMode:{ type: String,trim: true,},

    tawktochatlink:{ type: String,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('Other', appDetailsOtherSchema)