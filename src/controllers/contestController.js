const contestModel = require("../models/contestModel");
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


const addContestData = async function (req, res) {
  try {
      let body = req.body;
      let { startDate, endDate, status } = body;

      if (!isValidBody(body)) {
          return res.status(400).send({ status: false, message: "Body cannot be blank" });
      }

      if (!isValid(startDate)) {
          return res.status(400).send({ status: false, message: "startDate is required" });
      }

      if (!isValid(endDate)) {
          return res.status(400).send({ status: false, message: "endDate is required" });
      }

      // Create new record
      let newContestData = {
        startDate,
        endDate,
      };

      let contestData = await contestModel.create(newContestData);
      return res.status(201).send({ status: true, message: "contest data added successfully", contestData });
  } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Server-side Errors. Please try again later", error: error.message });
  }
};


const getContestData = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10; // Default page size is 10, you can customize it

        const contestData = await contestModel
            .find({ isDeleted: false })
            .select({ startDate: 1, endDate: 1, participants: 1, status: 1, _id: 1 })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (!contestData || contestData.length === 0) {
            return res.status(404).send({ status: false, msg: "No contestData found" });
        }

        return res.status(200).send({
            status: true,
            message: "contestData",
            contestData,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};


const contestDelete = async function (req, res) {
    try {
        let contestId = req.params.contestId;

        if (!ObjectId.isValid(contestId)) {
            return res.status(400).send({ status: false, message: "contest ID is invalid" });
        }

        let deletedContest = await contestModel.findOneAndDelete({ _id:contestId, isDeleted: false });

        if (!deletedContest) {
            return res.status(404).send({ status: false, message: "Contest does not exist" });
        }

        return res.status(200).send({ status: true, message: "Contest deleted successfully" });

    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};

  module.exports = {addContestData,getContestData,contestDelete}