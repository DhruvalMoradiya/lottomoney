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
        let pageSize = req.query.pageSize || 10;

        const contestData = await contestModel
            .find({ isDeleted: false })
            .select({ startDate: 1, endDate: 1, participants: 1, status: 1, _id: 1 })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Check each document for the presence of the status field and assign a default value if not present
        const modifiedContestData = contestData.map((contest) => ({
            startDate: contest.startDate,
            endDate: contest.endDate,
            participants: contest.participants,
            status: contest.status || "active", // Assign "active" if status is not present
            _id: contest._id,
        }));

        if (!modifiedContestData || modifiedContestData.length === 0) {
            return res.status(404).send({ status: false, msg: "No contestData found" });
        }

        return res.status(200).send({
            status: true,
            message: "contestData",
            contestData: modifiedContestData,
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const searchContest = async function (req, res) {
    try {
        let page = req.query.page || 1;
        let pageSize = req.query.pageSize || 10;

        const key = req.params.key;

        const query = {
            $or: [
                { status: { "$regex": key, "$options": "i" } },
                { startDate: { "$regex": key, "$options": "i" } },
                { endDate: { "$regex": key, "$options": "i" } },
                { participants: { "$regex": key, "$options": "i" } }
            ]
        };

        const recordData = await contestModel.find(query)
            .select({
                startDate: 1,
                endDate: 1,
                participants: 1,
                status: 1,
                _id: 1
            })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        if (recordData.length > 0) {
            res.status(200).send({ success: true, msg: "Contest Record details", data: recordData });
        } else {
            res.status(404).send({ success: false, msg: "Record not found" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};


const updateContest = async function (req, res) {
    try {
      let body = req.body
      let contestId = req.params.contestId
      
     // if (!isValidBody(body)) return res.status(400).send({ status: false, message: "Body is empty to update " })
       if (!isValidBody(body) && !req.files) return res.status(400).send({ status: false, message: "Body is empty to update " })
  
  
      let {startDate,endDate,participants,status} = body
  
      
      if ("startDate" in body) {
        if (!isValid(startDate)) return res.status(400).send({ status: false, message: "startDate required" })
      }
      if ("endDate" in body) {
        if (!isValid(endDate)) return res.status(400).send({ status: false, message: "endDate required" })
      }
      if ("participants" in body) {
        if (!isValid(participants)) return res.status(400).send({ status: false, message: "participants required" })
      }
      if ("status" in body) {
        if (!isValid(status)) return res.status(400).send({ status: false, message: "status required" })
      }
  
      let result = { startDate,endDate,participants,status}   
  
      let update = await contestModel.findOneAndUpdate({ _id:contestId }, result, { new: true })
  
      return res.status(200).send({ status: true, message: " contest  Updated successfully", data: update })
  
    } catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, message: "server side errors", error: err.message })
    }
  }

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


  module.exports = {addContestData,getContestData,searchContest,updateContest,contestDelete}