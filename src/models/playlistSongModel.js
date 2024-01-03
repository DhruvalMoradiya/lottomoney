const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const playListSongSchema = new mongoose.Schema({

    playListId: { type: ObjectId, ref: "playList", required: true,trim: true, },   

    songName: { type: String, required: true,trim: true,},

    singerName:{type: String, required: true,trim: true,},

    songImage: [],

    songFile: [],

    lyrics:[],

    deletedAt: { type: Date },
    
    isDeleted: { type: Boolean, default: false }

}, { timestamps: true })

module.exports = mongoose.model('playListSong', playListSongSchema)