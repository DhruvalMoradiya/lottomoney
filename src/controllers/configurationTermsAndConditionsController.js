const termsConditionsModel = require("../models/configurationTermsAndConditionsModel");
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

const addTermsAndCondition = async function (req, res) {
    try {
        let body = req.body;
        let { termsAndCondition } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(termsAndCondition)) {
            return res.status(400).send({ status: false, message: "termsAndCondition is required" });
        }

        let newTermsAndConditionData = { termsAndCondition };

        let mainTermsAndConditionData = await termsConditionsModel.create(newTermsAndConditionData);
        return res.status(201).send({ status: true, message: "termsConditionsdata created successfully", mainTermsAndConditionData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getTermsAndCondition = async function (req, res) {
  try {
      const termsConditionsDetail = await termsConditionsModel
          .find({ isDeleted: false })
          .select({ termsAndCondition: 1, _id: 0 })
          .sort({ createdAt: -1 });


      if (termsConditionsDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No termsConditionsDetail found" });
      }

      return res.status(200).json({
          status: true,
          message: "termsConditions",
          termsConditionsDetail,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {addTermsAndCondition,getTermsAndCondition}