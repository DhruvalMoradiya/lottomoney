const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const indiasBestSchema = new mongoose.Schema({

    indiasBestMainPlayListId: { type: ObjectId, ref: "indiasBestMain", required: true,trim: true, },   

    indiasBestPlayListSubName: { type: String, required: true,trim: true, },   

    playListImage: { type: String},

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('indiasBest', indiasBestSchema)