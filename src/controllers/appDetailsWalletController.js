const walletModel = require("../models/appDetailsWalletModel");
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


const addWalletData = async function (req, res) {
  try {
      let body = req.body;
      let { walletMode, minWithdraw, maxWithdraw, minDeposit, maxDeposit } = body;

      if (!isValidBody(body)) {
          return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }

      if (!isValid(walletMode)) {
          return res.status(400).send({ status: false, message: "walletMode is required" });
      }

      if (!isValid(minWithdraw)) {
          return res.status(400).send({ status: false, message: "minWithdraw is required" });
      }

      if (!isValid(maxWithdraw)) {
          return res.status(400).send({ status: false, message: "maxWithdraw is required" });
      }

      if (!isValid(minDeposit)) {
          return res.status(400).send({ status: false, message: "minDeposit is required" });
      }

      if (!isValid(maxDeposit)) {
          return res.status(400).send({ status: false, message: "maxDeposit is required" });
      }

      // Create new record
      let newWalletData = {
          walletMode,
          minWithdraw,
          maxWithdraw,
          minDeposit,
          maxDeposit,
      };

      let walletData = await walletModel.create(newWalletData);
      return res.status(201).send({ status: true, message: "Wallet data added successfully", walletData });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
  }
};



  const getWalletData = async function (req, res) {
    try {
        const walletData = await walletModel
            .findOne({ isDeleted: false })
            .select({  walletMode:1, minWithdraw:1, maxWithdraw:1, minDeposit:1, maxDeposit:1, _id: 0 })
            .sort({ createdAt: -1 });

        if (!walletData) {
            return res.status(404).send({ status: false, msg: "No walletdata found" });
        }

        return res.status(200).send({
            status: true,
            message: "walletdata",
            walletData,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

  module.exports = {addWalletData,getWalletData}