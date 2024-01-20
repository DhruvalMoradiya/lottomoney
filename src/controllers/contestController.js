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
        status,
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
        let sortFields = req.query.sortFields || ['startDate'];
        let sortOrder = req.query.sortOrder || 'asc';

        if (!Array.isArray(sortFields)) {
            sortFields = [sortFields];
        }

        let query = { isDeleted: false };

        // Check if it's a search query
        if (req.query.search) {
            const key = req.query.search;

            query.$or = [
                { status: { "$regex": key, "$options": "i" } },
                { startDate: { "$regex": key, "$options": "i" } },
                { endDate: { "$regex": key, "$options": "i" } },
                { participants: { "$regex": key, "$options": "i" } }
            ];
        }

        const contestData = await contestModel
            .find(query)
            .select({ startDate: 1, endDate: 1, participants: 1, status: 1, _id: 1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        // Always return a 200 status, whether data is found or not
        return res.status(200).send({
            status: true,
            message: "contestData",
            contestData: contestData.sort((a, b) => {
                for (const field of sortFields) {
                    const valueA = a[field];
                    const valueB = b[field];

                    if (field === 'participants') {
                        // Custom sorting for the participants field (treat as string)
                        const numericValueA = parseInt(valueA) || 0;
                        const numericValueB = parseInt(valueB) || 0;

                        if (numericValueA !== numericValueB) {
                            return sortOrder === 'asc' ? numericValueA - numericValueB : numericValueB - numericValueA;
                        }
                    } else {
                        // Default sorting for other fields
                        if (valueA !== undefined && valueB !== undefined) {
                            return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                        } else if (valueA !== undefined) {
                            return sortOrder === 'asc' ? 1 : -1;
                        } else if (valueB !== undefined) {
                            return sortOrder === 'asc' ? -1 : 1;
                        }
                    }
                }

                return 0;
            }),
        });
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
};

const searchContest = async function (req, res) {
    await getContestData(req, res, true);
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


const countUpcomingContests = async function (req, res) {
    try {
        // Use a case-insensitive regular expression for 'upcoming'
        const upcomingContestsCount = await contestModel.countDocuments({
            status: { $regex: new RegExp('upcoming', 'i') }
        });

        res.json({ success: true, message: 'Count Upcoming', count: upcomingContestsCount });
    } catch (error) {
        console.error('Error counting upcoming contests:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const countLiveContests = async function (req, res) {
    try {
        // Use a case-insensitive regular expression for 'upcoming'
        const liveContestsCount = await contestModel.countDocuments({
            status: { $regex: new RegExp('live', 'i') }
        });

        res.json({ success: true, message: 'Count Live', count: liveContestsCount });
    } catch (error) {
        console.error('Error counting upcoming contests:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const countFinishedContests = async function (req, res) {
    try {
        // Use a case-insensitive regular expression for 'upcoming'
        const finishedContestsCount = await contestModel.countDocuments({
            status: { $regex: new RegExp('finished', 'i') }
        });

        res.json({ success: true, message: 'Count Finished', count: finishedContestsCount });
    } catch (error) {
        console.error('Error counting upcoming contests:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const  countResultAnnouncedContests = async function (req, res) {
    try {
        // Use a case-insensitive regular expression for 'upcoming'
        const resultAnnouncedContestsCount = await contestModel.countDocuments({
            status: { $regex: new RegExp('resultannounced', 'i') }
        });

        res.json({ success: true, message: 'Count resultAnnounced', count: resultAnnouncedContestsCount });
    } catch (error) {
        console.error('Error counting upcoming contests:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

const countTotalContests = async function (req, res) {
    try {
        const totalContestsCount = await contestModel.countDocuments();

        res.json({ success: true, message: 'total Count ', count: totalContestsCount });
    } catch (error) {
        console.error('Error counting contests:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

  module.exports = {addContestData,getContestData,searchContest,updateContest,contestDelete,countUpcomingContests,countLiveContests,
                    countFinishedContests,countResultAnnouncedContests,countTotalContests}