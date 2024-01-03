const artistModel = require("../models/artistModel");
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

const addArtist = async function (req, res) {
    try {
        let body = req.body;
        let { artistName, language } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(artistName)) {
            return res.status(400).send({ status: false, message: "artistName is required" });
        }

        if (!isValid(language)) {
            return res.status(400).send({ status: false, message: "language is required" });
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

        let artistImage = uploadedFileURL;
        let newArtistData = { artistName, language, artistImage };

        let artistData = await artistModel.create(newArtistData);
        return res.status(201).send({ status: true, message: "artist created successfully", artistData });
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


const getArtist = async function (req, res) {
    try {
      let page = req.query.page || 1; // Default page is 1
      let pageSize = 40;
  
      const artistDetail = await artistModel
        .find({ isDeleted: false })
        .select({
          artistImage: 1,
          artistName: 1,
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .exec();
  
      if (artistDetail.length === 0) {
        return res.status(404).send({ status: false, msg: "No Video found" });
      }
  
      // Map the array of artistDetail to include both artistName and artistImage
      const artistData = artistDetail.map(artist => ({
        artistName: artist.artistName,
        artistImage: artist.artistImage,
      }));
  
      return res.status(200).json({
        status: true,
        message: "Artist List",
          artists: artistData,
        
      });
    } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
    }
  };

module.exports = {addArtist,getArtist}