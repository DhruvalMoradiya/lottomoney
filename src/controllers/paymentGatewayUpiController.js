const upiModel = require("../models/paymentGatewayUpiModel");
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

const addUpi = async function (req, res) {
    try {
        let body = req.body;
        let { upiID,upiMerchantCode,upiTransactionNote,upiPayeeName,upiToken } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(upiID)) {
            return res.status(400).send({ status: false, message: "upiID is required" });
        }

        if (!isValid(upiMerchantCode)) {
            return res.status(400).send({ status: false, message: "upiMerchantCode is required" });
        }

        if (!isValid(upiTransactionNote)) {
            return res.status(400).send({ status: false, message: "upiTransactionNote is required" });
        }

        if (!isValid(upiPayeeName)) {
            return res.status(400).send({ status: false, message: "upiPayeeName is required" });
        }

        if (!isValid(upiToken)) {
            return res.status(400).send({ status: false, message: "upiToken is required" });
        }

        let newUpiPayData = {  upiID,upiMerchantCode,upiTransactionNote,upiPayeeName,upiToken };

        let mainUpiData = await upiModel.create(newUpiPayData);
        return res.status(201).send({ status: true, message: "Upi Data created successfully", mainUpiData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getUpi = async function (req, res) {
  try {
      const upiDetail = await upiModel
          .findOne({ isDeleted: false })
          .select({ upiID:1,upiMerchantCode:1,upiTransactionNote:1,upiPayeeName:1,upiToken:1, _id: 0 })
          .sort({ createdAt: -1 });


      if (upiDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No upiDetail found" });
      }

      return res.status(200).json({
          status: true,
          message: "upi",
          upiDetail,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {addUpi,getUpi}