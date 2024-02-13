const sendNotificationModel = require("../models/sendNotificationModel");
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


const addSendNotificationData = async function (req, res) {
  try {
      let body = req.body;
      let { title, message, externalLink,imageURL} = body;

      if (!isValidBody(body)) {
          return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }

      if (!isValid(title)) {
          return res.status(400).send({ status: false, message: "title is required" });
      }

      if (!isValid(message)) {
          return res.status(400).send({ status: false, message: "message is required" });
      }

      if (!isValid(externalLink)) {
          return res.status(400).send({ status: false, message: "externalLink is required" });
      }

      if (!isValid(imageURL)) {
        return res.status(400).send({ status: false, message: "imageURL is required" });
    }

      let newSendNotificationData = {
        title, message, externalLink, imageURL
      };

      let sendNotificationData = await sendNotificationModel.create(newSendNotificationData);
      return res.status(201).send({ status: true, message: "sendNotification data added successfully", sendNotificationData });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
  }
};


  const getSendNotificationData = async function (req, res) {
    try {
        const sendNotificationData = await sendNotificationModel
            .find({ isDeleted: false })
            .select({ title:1, message:1, externalLink:1, imageURL:1,_id: 0 })
            
        if (!sendNotificationData) {
            return res.status(404).send({ status: false, msg: "No sendNotificationData found" });
        }

        return res.status(200).send({
            status: true,
            message: "SendNotification",
            sendNotificationData,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

  module.exports = {addSendNotificationData,getSendNotificationData}