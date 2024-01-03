const aboutUsModel = require("../models/configurationAboutModel");
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

const addAboutUs = async function (req, res) {
    try {
        let body = req.body;
        let { aboutUs } = body;

        if (!isValidBody(body)) {
            return res.status(400).send({ status: false, message: "Body cannot be blank" });
        }

        if (!isValid(aboutUs)) {
            return res.status(400).send({ status: false, message: "aboutUs is required" });
        }

        let newAboutUsData = { aboutUs };

        let mainAboutUsData = await aboutUsModel.create(newAboutUsData);
        return res.status(201).send({ status: true, message: "AboutUsData created successfully", mainAboutUsData });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message });
    }
}


const getAboutUs = async function (req, res) {
  try {
      const aboutUsDetail = await aboutUsModel
          .find({ isDeleted: false })
          .select({ aboutUs: 1, _id: 0 })
          .sort({ createdAt: -1 });


      if (aboutUsDetail.length === 0) {
          return res.status(404).send({ status: false, msg: "No aboutUs found" });
      }

      return res.status(200).json({
          status: true,
          message: "aboutUs",
          aboutUsDetail,
      });
  } catch (err) {
      res.status(500).json({ status: false, msg: err.message });
  }
};

module.exports = {addAboutUs,getAboutUs}