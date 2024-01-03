const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const indiasBestSongSchema = new mongoose.Schema({

    indiasBestSongPlayListId: { type: ObjectId, ref: "indiasBest", required: true,trim: true, },   

    songName: { type: String, required: true,trim: true,},

    songImage: [],

    songFile: [],

    lyrics:[],

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('indiasBestSong', indiasBestSongSchema)