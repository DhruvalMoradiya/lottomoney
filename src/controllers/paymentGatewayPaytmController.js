const paytmModel = require("../models/paymentGatewayPaytmModel");
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

const addPaytmData = async function (req, res) {
    try {
        let body = req.body;
        let { paytmMerchantID,paytmMerchantKey } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(paytmMerchantID)) {
            return res.status(400).send({ status: false, message: "paytmMerchantID is required" });
        }

        if (!isValid(paytmMerchantKey)) {
            return res.status(400).send({ status: false, message: "paytmMerchantKey is required" });
        }

        let newPaytmData = { paytmMerchantID,paytmMerchantKey };

        let mainPaytmData = await paytmModel.create(newPaytmData);
        return res.status(201).send({ status: true, message: "Paytm Data created successfully", mainPaytmData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getPaytmData = async function (req, res) {
  try {
      const paytmDetail = await paytmModel
          .findOne({ isDeleted: false })
          .select({ paytmMerchantID:1,paytmMerchantKey:1, _id: 0 })
          .sort({ createdAt: -1 });


      if (paytmDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No paytmData found" });
      }

      return res.status(200).json({
          status: true,
          message: "paytm",
          paytmDetail,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {addPaytmData,getPaytmData}