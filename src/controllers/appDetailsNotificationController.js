const notificationModel = require("../models/appDetailsNotificationModel");
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


const addNotification = async function (req, res) {
    try {
        let body = req.body;
        let { googleFCMserverkey } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(googleFCMserverkey)) {
            return res.status(400).send({ status: false, message: "googleFCMserverkey is required" });
        }

        // Update or create a record
        let result = await notificationModel.updateOne(
            { googleFCMserverkey: googleFCMserverkey },
            {
                $set: {
                    googleFCMserverkey: googleFCMserverkey,
                }
            },
            { upsert: true } // Add upsert option to create if not found
        );

        // Find the updated or created record
        let updatedRecord = await notificationModel.findOne({ googleFCMserverkey: googleFCMserverkey });

        return res.status(201).send({
            status: true,
            message: result.upserted ? "Notification added successfully" : "Notification updated successfully",
            notificationData: updatedRecord,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
    }
};
  


const getNotification = async function (req, res) {
    try {
        const notificationData = await notificationModel
            .findOne({ isDeleted: false })
            .select({ googleFCMserverkey: 1, _id: 0 })
            .sort({ createdAt: -1 });

        if (!notificationData) {
            return res.status(404).send({ status: false, msg: "No notification found" });
        }

        return res.status(200).send({
            status: true,
            message: "notification",
            googleFCMserverkey: notificationData.googleFCMserverkey,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

  module.exports = {addNotification,getNotification}