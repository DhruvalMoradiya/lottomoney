const otherModel = require("../models/appDetailsOtherModel");
const { uploadFile } = require("../aws/fileUpload");
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


const addOtherData = async function (req, res) {
  try {
    let body = req.body;
    let { countryCode, currencyCode, currencySign, timezone, sharePrize, downloadPrizeosit,
          bonusUsed, maintenanceMode, tawktochatlink } = body;

    if (!isValidBody(body)) {
      return res.status(400).send({ status: false, message: "Body cannot be blank" });
    }

    if (!isValid(countryCode)) {
      return res.status(400).send({ status: false, message: "countryCode is required" });
    }

    if (!isValid(currencyCode)) {
      return res.status(400).send({ status: false, message: "currencyCode is required" });
    }

    if (!isValid(currencySign)) {
      return res.status(400).send({ status: false, message: "currencySign is required" });
    }

    if (!isValid(timezone)) {
      return res.status(400).send({ status: false, message: "timezone is required" });
    }

    if (!isValid(sharePrize)) {
      return res.status(400).send({ status: false, message: "sharePrize is required" });
    }

    if (!isValid(downloadPrizeosit)) {
      return res.status(400).send({ status: false, message: "downloadPrizeosit is required" });
    }

    if (!isValid(bonusUsed)) {
      return res.status(400).send({ status: false, message: "bonusUsed is required" });
    }

    if (!isValid(maintenanceMode)) {
      return res.status(400).send({ status: false, message: "maintenanceMode is required" });
    }

    if (!isValid(tawktochatlink)) {
      return res.status(400).send({ status: false, message: "tawktochatlink is required" });
    }

    // Create new record
    let newOtherData = {
      countryCode, currencyCode, currencySign, timezone, sharePrize, downloadPrizeosit,
          bonusUsed, maintenanceMode, tawktochatlink
    };

    let otherData = await otherModel.create(newOtherData);
    return res.status(201).send({ status: true, message: "other data added successfully", otherData });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
  }
};



const getOtherData = async function (req, res) {
  try {
    const otherData = await otherModel
      .findOne({ isDeleted: false })
      .select({ countryCode:1, currencyCode:1, currencySign:1, timezone:1, sharePrize:1, downloadPrizeosit:1,
        bonusUsed:1, maintenanceMode:1, tawktochatlink:1, _id: 0 })
      .sort({ createdAt: -1 });

    if (!otherData) {
      return res.status(404).send({ status: false, msg: "No otherData found" });
    }

    return res.status(200).send({
      status: true,
      message: "otherData",
      otherData,
    });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { addOtherData, getOtherData }