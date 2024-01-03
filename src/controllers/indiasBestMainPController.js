const indiasBestMainplaylistModel = require("../models/indiasbestMainModel");
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

const addIndiasBestMainPlayList = async function (req, res) {
    try {
        let body = req.body;
        let { indiasBestPlayListMainName} = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(indiasBestPlayListMainName)) {
            return res.status(400).send({ status: false, message: "indiasBestPlayListMainName is required" });
        }

        let newplayListData = { indiasBestPlayListMainName };

        let mainPlayListData = await indiasBestMainplaylistModel.create(newplayListData);
        return res.status(201).send({ status: true, message: "indiasBestMainplaylist created successfully", mainPlayListData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getIndiasBestMainPlayList = async function (req, res) {
    try {
      let page = req.query.page || 1; // Default page is 1
      let pageSize = 40;
  
      const artistDetail = await indiasBestMainplaylistModel
        .find({ isDeleted: false })
        .select({
            indiasBestPlayListMainName: 1,
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
      const MainPlayListData = artistDetail.map(artist => ({
        indiasBestPlayListMainName: artist.indiasBestPlayListMainName,
        indiasBestMainPlayListId:artist._id

      }));
  
      return res.status(200).json({
        status: true,
        message: "Main PlayList",
        MainPlayList: MainPlayListData,
      });
    } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
    }
  };

module.exports = {addIndiasBestMainPlayList,getIndiasBestMainPlayList}