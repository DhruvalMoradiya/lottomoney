const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const adminSchema = new mongoose.Schema({

    firstName: { type: String,trim: true,},

    lastName: { type: String, trim: true,},

    mobile:{ type: String, unique: true,trim: true,},

    userName:{ type: String,trim: true,},

    email:{ type: String, trim: true,},

    phone: { type: String,trim: true,},

    avatar: { type: String},

    userDesignation:{type:String,trim: true,},

    password: { type: String, trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('LuckyLottoAdmin', adminSchema)