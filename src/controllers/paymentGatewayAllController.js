const paymentModel = require("../models/paymentGatewayAllModel");
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

const addPaymentData = async function (req, res) {
    try {
        let body = req.body;
        let {modeofPaymentId,razorPayAPIKey,paytmMerchantID,paytmMerchantKey,upiID,upiMerchantCode,upiTransactionNote,upiPayeeName,upiToken} = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        let newPaymentData = {modeofPaymentId,razorPayAPIKey,paytmMerchantID,paytmMerchantKey,upiID,upiMerchantCode,upiTransactionNote,upiPayeeName,upiToken };

        let mainPaymentData = await paymentModel.create(newPaymentData);
        return res.status(201).send({ status: true, message: "PaymentData created successfully", mainPaymentData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getPaymentData = async function (req, res) {
  try {
      const paytmDetail = await paymentModel
          .findOne({ isDeleted: false })
          .select({modeofPaymentId:1,razorPayAPIKey:1,paytmMerchantID:1,paytmMerchantKey:1,upiID:1,upiMerchantCode:1,upiTransactionNote:1,upiPayeeName:1,upiToken:1, _id: 0 })
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

module.exports = {addPaymentData,getPaymentData}