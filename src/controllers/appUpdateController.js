const appUpdateModel = require("../models/appUpdateModel");
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


const addAppUpdateData = async function (req, res) {
  try {
      let body = req.body;
      let { forceUpdate, latestVersionName, latestVersionCode, url, Description } = body;

      if (!isValidBody(body)) {
          return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }

      if (!isValid(forceUpdate)) {
          return res.status(400).send({ status: false, message: "forceUpdate is required" });
      }

      if (!isValid(latestVersionName)) {
          return res.status(400).send({ status: false, message: "latestVersionName is required" });
      }

      if (!isValid(latestVersionCode)) {
          return res.status(400).send({ status: false, message: "latestVersionCode is required" });
      }

      if (!isValid(url)) {
          return res.status(400).send({ status: false, message: "url is required" });
      }

      if (!isValid(Description)) {
          return res.status(400).send({ status: false, message: "Description is required" });
      }

      // Create new record
      let newAddUpdateData = {
        forceUpdate, latestVersionName, latestVersionCode, url, Description
      };

      let appUpdateData = await appUpdateModel.create(newAddUpdateData);
      return res.status(201).send({ status: true, message: "appUpdate data added successfully", appUpdateData });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
  }
};



  const getAppUpdateData = async function (req, res) {
    try {
        const appUpdateData = await walletModel
            .findOne({ isDeleted: false })
            .select({ forceUpdate:1, latestVersionName:1, latestVersionCode:1, url:1, Description:1, _id: 0 })
            .sort({ createdAt: -1 });

        if (!appUpdateData) {
            return res.status(404).send({ status: false, msg: "No appUpdateData found" });
        }

        return res.status(200).send({
            status: true,
            message: "appUpdateData",
            appUpdateData,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

  module.exports = {addAppUpdateData,getAppUpdateData}