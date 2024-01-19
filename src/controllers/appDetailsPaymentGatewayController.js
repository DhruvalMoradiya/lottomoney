const modeofPaymentModel = require("../models/appDetailsPaymentGatewayModel");
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

const addModeofPayment = async function (req, res) {
    try {
        let body = req.body;
        let { modeofPayment } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(modeofPayment)) {
            return res.status(400).send({ status: false, message: "modeofPayment is required" });
        }

        let newModeofPaymentData = { modeofPayment };

        let mainModeofPaymentData = await modeofPaymentModel.create(newModeofPaymentData);
        return res.status(201).send({ status: true, message: "modeofPayment Data created successfully", mainModeofPaymentData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getModeofPaymentDetail = async function (req, res) {
  try {
      const modeofPaymentDetail = await modeofPaymentModel
          .find({ isDeleted: false })
          .select({ modeofPayment: 1, _id: 1 })
          .sort({ createdAt: -1 });


      if (modeofPaymentDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No modeofPayment found" });
      }

      return res.status(200).json({
          status: true,
          message: "modeofPayment",
          modeofPaymentDetail,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {addModeofPayment,getModeofPaymentDetail}