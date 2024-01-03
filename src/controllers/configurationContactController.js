const contactUsModel = require("../models/configurationContactModel");
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

const addContactUs = async function (req, res) {
    try {
        let body = req.body;
        let { contactUs } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(contactUs)) {
            return res.status(400).send({ status: false, message: "contactUs is required" });
        }

        let newContactUsData = { contactUs };

        let mainContactUsData = await contactUsModel.create(newContactUsData);
        return res.status(201).send({ status: true, message: "ContactUsData created successfully", mainContactUsData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getContactUs = async function (req, res) {
  try {
      const contactUsDetail = await contactUsModel
          .find({ isDeleted: false })
          .select({ contactUs: 1, _id: 0 })

      if (contactUsDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No contactUs found" });
      }

      return res.status(200).json({
          status: true,
          message: "contactUs",
          contactUsDetail,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {addContactUs,getContactUs}