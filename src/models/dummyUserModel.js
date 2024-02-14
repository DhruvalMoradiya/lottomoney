const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const dummyUserSchema = new mongoose.Schema({

    customId: { type: String, required: true, unique: true },
    
    firstName:{ type: String,trim: true,},

    lastName:{ type: String,trim: true,},

    userName: { type: String,trim: true,},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('DummyUser', dummyUserSchema)