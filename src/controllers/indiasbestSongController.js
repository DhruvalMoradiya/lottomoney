const indiasBestSongModel = require("../models/indiasbestSongModel");
const {uploadFile} = require("../aws/fileUpload");
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");

const isValid = function (x) {
  if (typeof x === "undefined" || x === null) return false;
  if (typeof x === "string" && x.trim().length === 0) return false;
  return true;
};
const isValidBody = function (x) {
  return Object.keys(x).length > 0;
};


const indiasBestPlaylistAddSong = async function (req, res) {
    try {
      let body = req.body;
      let indiasBestSongPlayListId = req.params.indiasBestSongPlayListId;
      let {songName} = body;
  
      if (!ObjectId.isValid(indiasBestSongPlayListId)) {
        return res.status(400).send({ status: false, message: "indiasBestSongPlayListId is invalid" });
      }
  
      if (!isValidBody(body)) {
        return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }
  
      if (!isValid(songName)) {
        return res.status(400).send({ status: false, message: "songName is required" });
      }
  
    //   if (!isValid(indiasBestSongPlayListId)) {
    //     return res.status(400).send({ status: false, message: "indiasBestSongPlayListId is required" });
    //   }
  
    let files = req.files;
    let songFile = [];
    let songImage = [];
    let lyrics = [];

    if (files) {
      for (let i = 0; i < files.length; i++) {
        let file = files[i];

        if (isSupportedImageFile(file)) {
          if (file.fieldname === "songImage") {
            let uploadedFileURL = await uploadFile(file);
            songImage.push(uploadedFileURL);
          }
        } else if (isSupportedMp3File(file)) {
          if (file.fieldname === "songFile") {
            let uploadedFileURL = await uploadFile(file);
            songFile.push(uploadedFileURL);
          }
        } else if (isSupportedLrcFile(file)) {
            if (file.fieldname === "lyrics") {
              let uploadedFileURL = await uploadFile(file);
              lyrics.push(uploadedFileURL);
            }
          } else {
            return res.status(400).send({ status: false, message: "Unsupported file type" });
          }
      }
    }  
      let newplayListData = {
        indiasBestSongPlayListId,
        songName,
        songFile,
        songImage,
        lyrics,
      };
  
      let playListSong = await indiasBestSongModel.create(newplayListData);
  
      return res.status(201).send({ status: true, message: "playListSong add successfully", playListSong });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
  };


  function isSupportedImageFile(file) {
    const supportedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.originalname.split(".").pop();
    return supportedExtensions.includes(fileExtension.toLowerCase());
  }
  
  function isSupportedMp3File(file) {
    const supportedExtensions = ["mp3"];
    const fileExtension = file.originalname.split(".").pop();
    return supportedExtensions.includes(fileExtension.toLowerCase());
  }
  
  function isSupportedLrcFile(file) {
    const supportedExtensions = ["lrc"];
    const fileExtension = file.originalname.split(".").pop();
    return supportedExtensions.includes(fileExtension.toLowerCase());
  }


  const getIndiasBestPlayListSong = async function (req, res) {
    try {
        const indiasBestSongPlayListId = req.params.indiasBestSongPlayListId;

        if (!isValid(indiasBestSongPlayListId)) {
            return res.status(400).send({ status: false, message: "indiasBestSongPlayListId is required" });
        }

        if (!ObjectId.isValid(indiasBestSongPlayListId)) {
            return res.status(400).send({ status: false, message: "indiasBestSongPlayListId is invalid" });
        }

        const page = req.query.page || 1;
        const pageSize = 50;

        const playListSong = await indiasBestSongModel
            .find({ indiasBestSongPlayListId, isDeleted: false })
            .select({ songImage: 1, songName: 1, songFile: 1, lyrics: 1, _id: 0 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .exec();

        if (playListSong.length === 0) {
            return res.status(404).send({ status: false, msg: "No Song found" });
        }

        const transformedPlayListSongs = playListSong.map(song => {
            return {
                songName: song.songName,
                songImage: song.songImage.length > 0 ? song.songImage[0] : null,
                songFile: song.songFile.length > 0 ? song.songFile[0] : null,
                lyrics: song.lyrics.length > 0 ? song.lyrics[0] : null,
            };
        });

        return res.status(200).send({
            status: true,
            message: "indiasBestSongPlay songs",
            PlayListSongs: transformedPlayListSongs,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

  module.exports = {indiasBestPlaylistAddSong,getIndiasBestPlayListSong}