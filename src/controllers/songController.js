const songModel = require("../models/songModel");
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


const artistPlaylistAddSong = async function (req, res) {
    try {
      let body = req.body;
      let artistId = req.params.artistId;
      let {songName} = body;
  
      if (!ObjectId.isValid(artistId)) {
        return res.status(400).send({ status: false, message: "artistId is invalid" });
      }
  
      if (!isValidBody(body)) {
        return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }
  
      if (!isValid(songName)) {
        return res.status(400).send({ status: false, message: "songName is required" });
      }
  
      if (!isValid(artistId)) {
        return res.status(400).send({ status: false, message: "artistId is required" });
      }
  
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
          artistId,
          songName,
          songFile,
          songImage,
          lyrics,
      };
  
      let playListSong = await songModel.create(newplayListData);
  
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


  const getArtistPlayListSong = async function (req, res) {
    try {
        const artistId = req.params.artistId;

        if (!isValid(artistId)) {
            return res.status(400).send({ status: false, message: "artistId is required" });
        }

        if (!ObjectId.isValid(artistId)) {
            return res.status(400).send({ status: false, message: "artistId is invalid" });
        }

        const page = req.query.page || 1;
        const pageSize = 50;

        const playListSong = await songModel
            .find({ artistId, isDeleted: false })
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
            message: "artist songs",
            PlayListSongs: transformedPlayListSongs,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

  module.exports = {artistPlaylistAddSong,getArtistPlayListSong}