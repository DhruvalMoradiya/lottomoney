const privacyPolicyModel = require("../models/configurationPrivacyPolicyModel");
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

const addPrivacyPolicy = async function (req, res) {
    try {
        let body = req.body;
        let { privacyPolicy } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(privacyPolicy)) {
            return res.status(400).send({ status: false, message: "privacyPolicy is required" });
        }

        let newPrivacyPolicyData = { privacyPolicy };

        let mainPrivacyPolicyData = await privacyPolicyModel.create(newPrivacyPolicyData);
        return res.status(201).send({ status: true, message: "PrivacyPolicyData created successfully", mainPrivacyPolicyData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getPrivacyPolicy = async function (req, res) {
  try {
      const privacyPolicyDetail = await privacyPolicyModel
          .find({ isDeleted: false })
          .select({ privacyPolicy: 1, _id: 0 })
          .sort({ createdAt: -1 });


      if (privacyPolicyDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No privacyPolicyDetail found" });
      }

      return res.status(200).json({
          status: true,
          message: "privacyPolicy",
          privacyPolicyDetail,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {addPrivacyPolicy,getPrivacyPolicy}