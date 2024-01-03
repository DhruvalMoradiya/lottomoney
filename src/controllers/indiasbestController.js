const indiasBestplaylistModel = require("../models/indiasbestModel");
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

const addIndiasBestPlayList = async function (req, res) {
    try {
        let body = req.body;
        let indiasBestMainPlayListId = req.params.indiasBestMainPlayListId;
        let { indiasBestPlayListSubName} = body;
        if (!ObjectId.isValid(indiasBestMainPlayListId)) {
          return res.status(400).send({ status: false, message: "indiasBestMainPlayListId is invalid" });
        }
        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(indiasBestPlayListSubName)) {
            return res.status(400).send({ status: false, message: "indiasBestPlayListSubName is required" });
        }

        let files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).send({ message: "No file found. Please add artist Image" });
        }

        if (files.length > 1) {
            return res.status(400).send({ message: "Only one image file is allowed" });
        }

        let file = files[0];

        if (!isSupportedImageFile(file)) {
            return res.status(400).send({ status: false, message: "Only support jpg, jpeg, png file" });
        }

        let uploadedFileURL = await uploadFile(file);

        let playListImage = uploadedFileURL;
        let newplayListData = { indiasBestPlayListSubName, playListImage,indiasBestMainPlayListId };

        let playListData = await indiasBestplaylistModel.create(newplayListData);
        return res.status(201).send({ status: true, message: "indiasBestplaylist created successfully", playListData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}

function isSupportedImageFile(file) {
    const supportedExtensions = ["jpg", "jpeg", "png"];
    const fileExtension = file.originalname.split(".").pop();
    return supportedExtensions.includes(fileExtension.toLowerCase());
}


const getIndiasBestPlayList = async function (req, res) {
    try {
      const indiasBestMainPlayListId = req.params.indiasBestMainPlayListId;

      if (!isValid(indiasBestMainPlayListId)) {
          return res.status(400).send({ status: false, message: "indiasBestMainPlayListId is required" });
      }

      if (!ObjectId.isValid(indiasBestMainPlayListId)) {
          return res.status(400).send({ status: false, message: "indiasBestMainPlayListId is invalid" });
      }

      let page = req.query.page || 1; // Default page is 1
      let pageSize = 40;
  
      const artistDetail = await indiasBestplaylistModel
        .find({ indiasBestMainPlayListId,isDeleted: false })
        .select({
          playListImage: 1,
          indiasBestPlayListSubName: 1,
          _id:1
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();
  
      if (artistDetail.length === 0) {
        return res.status(404).send({ status: false, msg: "No playlist found" });
      }
  
      // Map the array of artistDetail to include both artistName and artistImage
      const playListData = artistDetail.map(artist => ({
        indiasBestPlayListSubName: artist.indiasBestPlayListSubName,
        playListImage: artist.playListImage,
        playListId:artist._id

      }));
  
      return res.status(200).json({
        status: true,
        message: "PlayList",
        PlayList: playListData,
      });
    } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
    }
  };


module.exports = {addIndiasBestPlayList,getIndiasBestPlayList}