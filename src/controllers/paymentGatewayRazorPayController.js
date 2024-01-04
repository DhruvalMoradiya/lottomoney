const razorPayModel = require("../models/paymentGatewayRazorPayModel");
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

const addRazorPay = async function (req, res) {
    try {
        let body = req.body;
        let { razorPayAPIKey } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(razorPayAPIKey)) {
            return res.status(400).send({ status: false, message: "razorPayAPIKey is required" });
        }

        let newRazorPayData = { razorPayAPIKey };

        let mainRazorPayData = await razorPayModel.create(newRazorPayData);
        return res.status(201).send({ status: true, message: "razorPay Data created successfully", mainRazorPayData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getRazorPay = async function (req, res) {
  try {
      const razorPayDetail = await razorPayModel
          .findOne({ isDeleted: false })
          .select({ razorPayAPIKey: 1, _id: 0 })
          .sort({ createdAt: -1 });


      if (razorPayDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No razorPayData found" });
      }

      return res.status(200).json({
          status: true,
          message: "razorPay",
          razorPayDetail,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {addRazorPay,getRazorPay}